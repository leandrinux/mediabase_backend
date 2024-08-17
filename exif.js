const exif = require('exiftool')
const { data } = require('./data.js')
const { fileops } = require('./fileops.js')
const { create } = require('domain')
const fs = require('fs').promises

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
  console.log(`Parsing date ${dateStr}`)
  const regex = /^(?<year>\d+):(?<month>\d+):(?<day>\d+) (?<hour>\d+):(?<minutes>\d+):\d+(\.\d+)?(?<tz>(\-|\+)\d{2}:\d{2})?/gm
  var {year, month, day, hour, minutes, tz} = regex.exec(dateStr).groups
  if (!tz) tz = ""
  return [
    `${year}/${month}/${day}`,
    `${year}-${month}-${day}T${hour}:${minutes}${tz}`
  ]
}

async function getMetadata(path) {
  const data = await fs.readFile(path)
  return new Promise((resolve, reject) => {
    exif.metadata(data, function (err, metadata) {
      if (err) reject(err) 
      else resolve(metadata)
    });
  })
}

exports.exif = {

  saveMetadata: async (media, fullMediaPath) => {
    console.log(`[ ] Extracting metadata from ${fullMediaPath}`)
    const metadata = await getMetadata(fullMediaPath)
    
    var mediaTreeLocation, createDate
    if (metadata.createDate) {
      [ mediaTreeLocation, createDate ] = parseDate(metadata.createDate)
    } else {
      const today = new Date()
      mediaTreeLocation = `${today.getFullYear()}/${today.getMonth()}/${today.getDay()}`
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
    await data.addExifData(media.id, values)
  }

}