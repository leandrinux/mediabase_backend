const fs = require('fs')
const path = require('path')
const { data } = require('./data.js')

/*
  Used to verify if a file exists in a certain path. If it does, then a new
  filename is generated by appending an incremental number at the end.
  If the file path doesn't exist then the original filename is returned
  without changes. We use this to deal with images that have the same name and date
  but may be different
*/
function generateFilename(filename) {
  var generatedFilename = `${global.mediabasePath}/${filename}`
  var number = 2
  const directory = path.dirname(filename)
  const basename = path.basename(filename)
  const extension = path.extname(filename)
  while (fs.existsSync(generatedFilename)) {
    generatedFilename = `${global.mediabasePath}/${directory}${basename} (${number})${extension}`
    number += 1
  }
  return generatedFilename
}
  
exports.fileops = {

  /*
    Used to move media from the original temp directory to its final
    destination in the media tree
  */
  relocateMedia: async (mediaId, originalPath) => {
      const currentFullPath = await data.getFileFullPath(mediaId)
      const finalFullPath = generateFilename(currentFullPath)
      const mediaPath = path.dirname(finalFullPath)
      if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath, { recursive: true })
      } 
      console.log(`[ ] Moving ${originalPath} to ${finalFullPath}`)
      await fs.promises.rename(originalPath, finalFullPath)
      if (currentFullPath != finalFullPath) {
        await data.setFileName(mediaId, path.basename(finalFullPath))
      }
      return finalFullPath
    }

}