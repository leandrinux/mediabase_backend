import im from 'imagemagick'
import fs from 'fs'
import path from 'path'
import paths from '../paths.js'
import data from '../data/index.js'

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

export default {

    /*
    Uses imagemagick to create a photo preview from original photo
    and saves it in the previews directory, which is also created if it doesn't exist.
    This won't work for other media like videos!
    */
    makePreview: async (media) => {

        if (media.media_type != 'image') {
            console.log('[ ] Cannot generate previews from videos yet')
            return
        }

        const fullMediaPath = paths.getFullMediaPath(media)
        const previewDirectory = `${paths.getPreviewsPath()}/${media.file_path}`
        console.log(`[ ] Making preview for ${fullMediaPath}`)
        const basename_no_extension = path.basename(media.file_name).replace(/\.[^/.]+$/, "")
        const previewPath = `${previewDirectory}/${basename_no_extension}.jpg`
        if (!fs.existsSync(previewDirectory)) {
            fs.mkdirSync(previewDirectory, { recursive: true })
        }
        await resizeImageAsync(fullMediaPath, previewPath, 350)
        console.log(`[ ] Preview made successfully`)
    }

}