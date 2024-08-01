const exif = require('exiftool')
const { data } = require('./data.js')
const { fileops } = require('./fileops.js')
const path = require('path')
const { create } = require('domain')

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
  const regex = /^(?<year>\d+):(?<month>\d+):(?<day>\d+) (?<hour>\d+):(?<minutes>\d+):\d+\.\d+(?<tz>(\-|\+)\d{2}:\d{2})/gm
  const {year, month, day, hour, minutes, tz} = regex.exec(dateStr).groups
  return [
    `media/${year}/${month}/${day}/`,
    `${year}-${month}-${day}T${hour}:${minutes}${tz}`
  ]
}

async function getMetadata(path) {
  const fs = require('fs').promises
  const data = await fs.readFile(path)
  return new Promise((resolve, reject) => {
    exif.metadata(data, function (err, metadata) {
      if (err) reject(err) 
      else resolve(metadata)
    });
  })
}

exports.exif = {

  saveMetadata: async (mediaId, path) => {
    console.log(`[ ] Extracting metadata from ${mediaId} at ${path}`)
    const metadata = await getMetadata(path)
    
    var mediaTreeLocation, createDate
    if (metadata.createDate) {
      [ mediaTreeLocation, createDate ] = parseDate(metadata.createDate)
    } else {
      const today = new Date()
      mediaTreeLocation = `media/${today.getFullYear()}/${today.getMonth()}/${today.getDay()}/`
      createDate = today.toISOString()
    }

    const values = {
      createDate: createDate,
      filePath: mediaTreeLocation,
      mimeType: metadata.mimeType,
      width: metadata.imageWidth,
      height: metadata.imageHeight,
      latitude: parseCoordinate(metadata.gpsLatitude),
      longitude: parseCoordinate(metadata.gpsLongitude)
    }  
    await data.addExifData(mediaId, values)
  }

}