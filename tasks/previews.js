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
        .outputOptions('-r 2')            // framerate of the output file (2 per sec)
        .outputOptions('-t 5')            // output is 5 second max
        .videoFilters('scale=300:-1')     // reduce to 300 in width and proportional in height
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
    const basename_no_extension = path.basename(media.file_name).replace(/\.[^/.]+$/, "")
    if (!fs.existsSync(previewDirectory)) {
        fs.mkdirSync(previewDirectory, { recursive: true })
    }
    
    console.log(`[ ] Making static preview for ${fullMediaPath}`)
    const staticPreviewPath = `${previewDirectory}/${basename_no_extension}.jpg`
    await makeStaticPreview(fullMediaPath, staticPreviewPath)    

    console.log(`[ ] Making animated video preview for ${fullMediaPath}`)
    const animatedPreviewPath = `${previewDirectory}/${basename_no_extension}.gif`
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