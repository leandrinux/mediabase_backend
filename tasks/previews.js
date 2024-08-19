import fs from 'fs'
import path from 'path'
import paths from '../paths.js'
import { resizeImageAsync } from './images.js'
import ffmpeg from 'fluent-ffmpeg'

async function makeImagePreview(media) {
    const fullMediaPath = paths.getFullMediaPath(media)
    const previewDirectory = `${paths.getPreviewsPath()}/${media.file_path}`
    const basename_no_extension = path.basename(media.file_name).replace(/\.[^/.]+$/, "")
    const previewPath = `${previewDirectory}/${basename_no_extension}.jpg`
    console.log(`[ ] Making image preview for ${fullMediaPath}`)
    if (!fs.existsSync(previewDirectory)) {
        fs.mkdirSync(previewDirectory, { recursive: true })
    }
    await resizeImageAsync(fullMediaPath, previewPath, 350)
    console.log(`[ ] Preview made successfully`)
}

async function makeAnimatedPreview(input, output) { 
    console.log(`[ ] Started making animated preview from ${input} to ${output}`);
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
            console.log(`[ ] Completed animated preview`);
            resolve()
        }) 
        .on('error', (error) => {
            console.log(`[ ] Failed while making animated preview`);
            reject(error);
        })
    })
}

async function makeStaticPreview(input, output) { 
    console.log(`[ ] Started making static preview from ${input} to ${output}`);
    return new Promise((resolve, reject) => {
        ffmpeg()
        .input(input)
        .outputOptions('-vframes 1')      // take only one frame
        .saveToFile(output)
        .on('end', () => {
            console.log(`[ ] Completed static preview`);
            resolve()
        }) 
        .on('error', (error) => {
            console.log(`[ ] Failed while making static preview`);
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
    
    console.log(`[ ] Making static preview for ${fullMediaPath}`)
    const staticPreviewPath = paths.getFullPreviewPath(media)
    await makeStaticPreview(fullMediaPath, staticPreviewPath)    

    console.log(`[ ] Making animated video preview for ${fullMediaPath}`)
    const animatedPreviewPath = paths.getFullPreviewPath(media, true)
    await makeAnimatedPreview(fullMediaPath, animatedPreviewPath)    
}

export default {

    makePreview: async (media) => {
        if (media.media_type == 'image')
            await makeImagePreview(media)
        else if (media.media_type == 'video')
            await makeVideoPreview(media)
        else
            console.log(`[ ] Cannot generate preview from media of type ${media.media_type}`) 
    }

}