import { createWorker } from 'tesseract.js'
import data from '../data/index.js'
import paths from '../paths.js'
import gm from 'gm'
import fs from 'node:fs/promises'

export async function preprocessImage(srcPath, dstPath) {
    return new Promise((resolve, reject) => {
        gm(srcPath)
        .autoOrient()
        .antialias(false)
        .type("Grayscale")
        .sharpen(20)
        .write(dstPath, (err) => {
            if (err) reject(err) 
            else resolve()
        })
    })
}

export default async function performOCR(media) {

    if (media.media_type != 'image') {
        console.log('[ ] Optical character recognition with tesseract is only supported in images')
        return
    }

    const originalMediaPath = paths.getFullMediaPath(media)
    const tempFilePath = `${paths.getRandomTempFilePath()}.jpg`
    console.log(`[ ] Preprocessing ${originalMediaPath} for OCR`)
    await preprocessImage(originalMediaPath, tempFilePath)

    console.log(`[ ] Running OCR on ${tempFilePath}`)
    const worker = await createWorker('eng')
    const ret = await worker.recognize(tempFilePath)
    await data.addOCRText(media.id, ret.data.text)
    await worker.terminate()

    await fs.unlink(tempFilePath, () => {} )

}
