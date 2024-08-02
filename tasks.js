const { exif } = require('./exif.js');
const { data } = require('./data.js');
const { thumbnails } = require('./thumbnails.js');
const { ocr } = require('./ocr.js');
const { fileops } = require('./fileops.js')
const { tags } = require('./tags.js')

exports.tasks = {

    // adds new media to the database by copying it to the temp
    // directory and creating the initial record in the media table
    addMedia: async (path) => {
        console.log(`[ ] Adding media ${path}`)
        return await data.addMedia(path)
    },

    // extracts and saves exif data for the specified media
    saveMetadata: exif.saveMetadata,

    // relocates media from the temp folder to its final place
    relocateMedia: fileops.relocateMedia,
    
    // creates a thumbnail for the specified media
    makeThumbnail: thumbnails.makePhotoThumbnail,

    // uses tesseract to attempt OCR in the photos being uploaded
    runOCR: ocr.run,

    // autogenerated tags based on date and time
    autoTag: tags.autoTag
}