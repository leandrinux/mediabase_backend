const im = require('imagemagick')
const fs = require('fs')
const path = require("path")
const { data } = require('./data.js');

exports.thumbnails = {

    /*
    Uses imagemagick to create a photo thumbnail from original photo
    and saves it in the thumbs directory, which is also created if it doesn't exist.
    This won't work for other media like videos!
    */
    makePhotoThumbnail: (mediaId, mediaPath) => {
        console.log(`[ ] Making thumbnail for media #${mediaId} at ${mediaPath}`)
        const thumbnailFileName = `${path.basename(mediaPath)}`
        const thumbnailDirectory = `${path.dirname(mediaPath)}/thumbs`
        const thumbnailFinalPath = `${thumbnailDirectory}/${thumbnailFileName}`
        if (!fs.existsSync(thumbnailDirectory)) {
            fs.mkdirSync(thumbnailDirectory)
        }
        im.resize({
            srcPath: mediaPath,
            // srcFormat: "heic",
            dstPath: thumbnailFinalPath,
            format: 'jpg',
            width: 350
        }), (err, stdout, stderr) => {
            if (err) throw err;
            console.log(stderr)
        }
    }

}