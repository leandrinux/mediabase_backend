const exif = require('exiftool');
const fs   = require('fs');
const { data } = require('./data.js');

function fixCoordinate(coordinate) {
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
  
function getMetadata(path, cb) {
    fs.readFile(path, function (err, data) {
        if (err) return cb(err)
        exif.metadata(data, function (err, metadata) {
            if (err) return cb(err)
            cb(null, metadata)
        });
      });
}

function saveExif (photo_id, path) {
    console.log(`Extracting exif data for photo ${photo_id} at ${path}`)
    getMetadata(path, function(err, metadata) {
        data.saveExifData(photo_id, {
            latitude: fixCoordinate(metadata.gpsLatitude),
            longitude: fixCoordinate(metadata.gpsLongitude)
        })
    })
}

exports.exif = {
    saveExif: saveExif
}