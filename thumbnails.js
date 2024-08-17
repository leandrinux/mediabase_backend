const im = require('imagemagick')
const fs = require('fs')
const path = require('path')
const { paths } = require("./paths.js")
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
    makeThumbnail: async (media) => {
        const fullMediaPath = paths.getFullMediaPath(media)
        const thumbnailDirectory = `${paths.getThumbnailsPath()}/${media.file_path}`
        console.log(`[ ] Making thumbnail for ${media.id} at ${fullMediaPath}`)
        const basename_no_extension = path.basename(media.file_name).replace(/\.[^/.]+$/, "")
        const thumbnailPath = `${thumbnailDirectory}/${basename_no_extension}.jpg`
        if (!fs.existsSync(thumbnailDirectory)) {
            fs.mkdirSync(thumbnailDirectory, { recursive: true })
        }
        await resizeImageAsync(fullMediaPath, thumbnailPath, 350)
        console.log(`[ ] Thumbnail made successfully`)
    }

}