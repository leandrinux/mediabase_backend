const { createWorker } = require('tesseract.js');
const { data } = require('./data.js')

async function run(mediaId, path) {
    const mimeType = await data.getMimeType(mediaId)
    if (mimeType == 'image/heic') return
    console.log(`running ocr on #${mediaId} at ${path}`)
    const worker = await createWorker('eng')
    const ret = await worker.recognize(path)
    await data.addOCRText(mediaId, ret.data.text)
    await worker.terminate()
}

exports.ocr = {
    run: run
}