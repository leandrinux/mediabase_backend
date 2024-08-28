import fs from 'fs'
import path from 'path'
import paths from '../paths.js'
import { resizeImageAsync } from './images.js'
import ffmpeg from 'fluent-ffmpeg'
import msg from '../log.js'

async function makeImagePreview(media) {
    const fullMediaPath = paths.getFullMediaPath(media)
    const previewDirectory = `${paths.getPreviewsPath()}/${media.file_path}`
    const basename_no_extension = path.basename(media.file_name).replace(/\.[^/.]+$/, "")
    const previewPath = `${previewDirectory}/${basename_no_extension}.jpg`
    msg.dbg(`Making image preview for ${fullMediaPath}`)
    if (!fs.existsSync(previewDirectory)) {
        fs.mkdirSync(previewDirectory, { recursive: true })
    }
    await resizeImageAsync(fullMediaPath, previewPath, 350)
    msg.success(`${media.file_name} preview made`)
}

async function makeAnimatedPreview(media, input, output) { 
    msg.dbg(`Started making animated preview from ${input} to ${output}`);
    return new Promise((resolve, reject) => {
        ffmpeg()
        .input(input)
        .outputOptions('-r 5')            // framerate of the output file (5 per sec)
        .outputOptions('-t 3')            // output is 3 seconds max
        .outputOptions('-an')             // remove audio
        .outputOptions('-y')              // do not prompt for confirmation
        .videoFilters('crop=trunc(iw/2)*2:trunc(ih/2)*2')   // crop to make even width and height (required)
        .saveToFile(output)
        .on('end', () => {
            msg.success(`${media.file_name} animated preview made`);
            resolve()
        }) 
        .on('error', (error) => {
            msg.err(`Failed while making animated preview`);
            reject(error);
        })
    })
}

async function makeStaticPreview(media, input, output) { 
    msg.log(`Started making static preview from ${input} to ${output}`);
    return new Promise((resolve, reject) => {
        ffmpeg()
        .input(input)
        .outputOptions('-vframes 1')      // take only one frame
        .saveToFile(output)
        .on('end', () => {
            msg.success(`${media.file_name} static preview made`);
            resolve()
        }) 
        .on('error', (error) => {
            msg.err(`Failed while making static preview`);
            reject(error);
        })
    })
}

async function makeVideoPreview(media) {
    const fullMediaPath = paths.getFullMediaPath(media)
    const previewDirectory = `${paths.getPreviewsPath()}/${media.file_path}`
    if (!fs.existsSync(previewDirectory)) {
        fs.mkdirSync(previewDirectory, { recursive: true })
    }
    
    const staticPreviewPath = paths.getFullPreviewPath(media)
    await makeStaticPreview(media, fullMediaPath, staticPreviewPath)    

    const animatedPreviewPath = paths.getFullPreviewPath(media, true)
    await makeAnimatedPreview(media, fullMediaPath, animatedPreviewPath)    
}

export default {

    makePreview: async (media) => {
        if (media.media_type == 'image')
            await makeImagePreview(media)
        else if (media.media_type == 'video')
            await makeVideoPreview(media)
        else
            msg.log(`Cannot generate preview from media of type ${media.media_type}`) 
    }

}