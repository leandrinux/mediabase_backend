import { createWorker } from 'tesseract.js'
import data from '../data/index.js'
import paths from '../paths.js'
import gm from 'gm'
import fs from 'node:fs/promises'
import msg from '../log.js'

var pendingWork = 0

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

    // run tesseract
    pendingWork += 1
    const worker = await createWorker('eng')
    const ret = await worker.recognize(tempFilePath)
    await worker.terminate()
    pendingWork -= 1

    // take 4 char or longer words or numbers from the output
    const textOutput = ret.data.text
    const regex = /(?<word>[0-9a-zA-Z]{4,15})/gm
    const matches = [...textOutput.matchAll(regex)]
    
    // save the clean results
    if (matches.length>0) {
        const words = matches.map(x => x.groups.word.toLowerCase()).join(',')
        await data.ocr.addOCRText(media.id, words)
    }

    msg.dbg(`Finished OCR on ${tempFilePath}, deleting temp file`)
    await fs.unlink(tempFilePath, () => {} )

    if (pendingWork>0) {
        msg.success(`${media.file_name} OCR completed (${pendingWork} remaining)`)
    } else {
        msg.success(`${media.file_name} OCR completed (queue is empty)`)
    }

}
