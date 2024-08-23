import exif from '../exiftool.js'
import fs from 'node:fs/promises'
import data from '../data/index.js'
import msg from '../log.js'

function parseCoordinate(coordinate) {
  if (coordinate === undefined) return undefined
  try {
    const regex = /^(?<deg>\d{1,3}) deg (?<min>\d{1,2})' (?<sec>\d{1,2}(.\d{1,3})?)" (?<dir>N|S|W|E)$/gm
    const groups = regex.exec(coordinate).groups
    const {deg, min, sec, dir} = groups
    let value = parseFloat(deg) + parseFloat(min)/60 + parseFloat(sec)/3600
    if ((dir=='W') || (dir=='S')) value = -value
    return value
  } catch (err) {
    throw new Error(`Coordinate format error (${err})`)
  }
}

function parseDate(dateStr) {
  const regex = /^(?<year>\d+):(?<month>\d+):(?<day>\d+) (?<hour>\d+):(?<minutes>\d+):\d+(\.\d+)?(?<tz>(\-|\+)\d{2}:\d{2})?/gm
  var {year, month, day, hour, minutes, tz} = regex.exec(dateStr).groups
  if (!tz) tz = ""
  return [
    `${year}/${month}/${day}`,
    `${year}-${month}-${day}T${hour}:${minutes}${tz}`
  ]
}

function getMediaTypeFromMimeType(mimeType) {
  const supportedImageTypes = new Set(['image/jpeg', 'image/webp', 'image/png', 'image/heic'])
  const supportedVideoTypes = new Set(['video/quicktime'])
  if (supportedImageTypes.has(mimeType))
    return 'image'
  else if (supportedVideoTypes.has(mimeType))
    return 'video'
  else {
    msg.warn(`mimeType ${mimeType} not recognized as valid media type`)
    return 'unknown'
  }
}

export default async function saveMetadata(media, fullMediaPath) {
  msg.dbg(`Extracting metadata from ${fullMediaPath}`)

  const metadata = await exif.run(fullMediaPath)
  
  const date = metadata.createDate ?? new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const mediaTreeLocation = `${year}/${month}/${day}`
  const createDate = date.toISOString()

  const values = {
    createDate: createDate,
    filePath: mediaTreeLocation,
    mimeType: metadata.mimeType,
    mediaType: getMediaTypeFromMimeType(metadata.mimeType),
    width: metadata.imageWidth,
    height: metadata.imageHeight,
    latitude: parseCoordinate(metadata.gpsLatitude),
    longitude: parseCoordinate(metadata.gpsLongitude)
  }  
  await data.addExifData(media.id, values)
  msg.log('Metadata saved successfully')
}