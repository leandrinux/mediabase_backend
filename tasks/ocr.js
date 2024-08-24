import { createWorker } from 'tesseract.js'
import data from '../data/index.js'
import paths from '../paths.js'
import gm from 'gm'
import fs from 'node:fs/promises'
import msg from '../log.js'

export async function preprocessImage(srcPath, dstPath) {
    return new Promise((resolve, reject) => {
        gm(srcPath)
        .autoOrient()
        .antialias(false)
        .type("Grayscale")
        .write(dstPath, (err) => {
            if (err) reject(err) 
            else resolve()
        })
    })
}

export default async function performOCR(media) {

    if (media.media_type != 'image') {
        msg.warn('Optical character recognition with tesseract is only supported in images')
        return
    }

    const originalMediaPath = paths.getFullMediaPath(media)
    const tempFilePath = `${paths.getRandomTempFilePath()}.jpg`
    msg.dbg(`Preprocessing ${originalMediaPath} for OCR`)
    await preprocessImage(originalMediaPath, tempFilePath)

    msg.dbg(`Running OCR on ${tempFilePath}`)

    const worker = await createWorker('eng')
    const ret = await worker.recognize(tempFilePath)
    await data.media.addOCRText(media.id, ret.data.text)
    await worker.terminate()

    msg.dbg(`Finished OCR on ${tempFilePath}, deleting temp file`)
    await fs.unlink(tempFilePath, () => {} )
    msg.log(`Optical character recognition completed successfully`)
}
