const fs = require('fs')
const path = require('path')
const { data } = require('./data.js')

async function relocateMedia(mediaId, originalPath) {
  const finalFullPath = await data.getFileFullPath(mediaId)
  const mediaPath = path.dirname(finalFullPath)
  if (!fs.existsSync(mediaPath)) {
    fs.mkdirSync(mediaPath, { recursive: true })
  } 
  console.log(`moving ${originalPath} to ${finalFullPath}`)
  await fs.promises.rename(originalPath, finalFullPath)
  return finalFullPath
}

exports.fileops = {
    relocateMedia: relocateMedia
}