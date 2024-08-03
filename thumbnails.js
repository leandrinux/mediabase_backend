const im = require('imagemagick')
const fs = require('fs')
const path = require("path")
const { data } = require('./data.js')

async function resizeImageAsync(srcPath, dstPath, width) {
    return new Promise((resolve, reject) => {
        im.resize({
            srcPath: srcPath,
            dstFormat: 'jpg',
            dstPath: dstPath,
            width: width
        }, (err, stdout, stderr) => {
            if (err) reject(err)
            else resolve()
        })        
    })
}

exports.thumbnails = {

    /*
    Uses imagemagick to create a photo thumbnail from original photo
    and saves it in the thumbs directory, which is also created if it doesn't exist.
    This won't work for other media like videos!
    */
    makePhotoThumbnail: async (mediaId, mediaPath) => {
        console.log(`[ ] Making thumbnail for media #${mediaId} at ${mediaPath}`)
        const components = path.parse(mediaPath)
        const thumbnailFileName = `${components.name}`
        const thumbnailDirectory = `${components.dir}/thumbs`
        const thumbnailFinalPath = `${thumbnailDirectory}/${thumbnailFileName}.jpg`
        if (!fs.existsSync(thumbnailDirectory)) {
            fs.mkdirSync(thumbnailDirectory)
        }
        await resizeImageAsync(mediaPath, thumbnailFinalPath, 350)
        console.log(`[ ] Thumbnail made successfully`)
    }

}