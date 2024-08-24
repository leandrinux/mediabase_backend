import data from '../data/index.js'
import saveMetadata from './exif.js'
import performOCR from './ocr.js'
import scanQR from './qrcode.js'
import autoTag from './autotag.js'
import previews from './previews.js'
import fileops from './fileops.js'
import AI from './AI.js'
import msg from '../log.js'

export default {

    // adds new media to the database by copying it to the temp
    // directory and creating the initial record in the media table
    addMedia: async (mediaFilename) => {
        msg.log(`Adding media ${mediaFilename}`)
        return await data.media.addMedia(mediaFilename)
    },

    // extracts and saves exif data for the specified media
    saveMetadata: saveMetadata,

    // relocates media from the temp folder to its final place
    relocateMedia: fileops.relocateMedia,
    
    // creates a preview for the specified media
    makePreview: previews.makePreview,

    // uses tesseract to attempt OCR in the photos being uploaded
    runOCR: performOCR,

    // autogenerated tags based on AI model
    generateAITags: AI.generateTags,

    // adds automatic tags based on date and other data
    autoTag: autoTag,

    // scans for QR codes in the image
    scanQR: scanQR
}