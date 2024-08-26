import data from '../data/index.js'
import msg from '../log.js'

const supportedImageTypes = new Set([
  'image/jpeg', 'image/webp', 'image/png', 'image/heic'
])

const supportedVideoTypes = new Set([
  'video/quicktime'
])

export const supportedTypes = new Set([
  ...supportedImageTypes, ...supportedVideoTypes
])

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

function getMediaTypeFromMimeType(mimeType) {
  if (supportedImageTypes.has(mimeType))
    return 'image'
  else if (supportedVideoTypes.has(mimeType))
    return 'video'
  else {
    msg.warn(`mimeType ${mimeType} not recognized as valid media type`)
    return 'unknown'
  }
}

export async function saveMetadata(media, metadata) {
  msg.dbg(`Saving metadata`)
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
  await data.media.addExifData(media.id, values)
  msg.success(`${media.file_name} metadata saved`)
  
}