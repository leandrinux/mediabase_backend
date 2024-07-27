const { createWorker } = require('tesseract.js');
const { data } = require('./data.js')

async function run(media_id, path) {
    console.log(`running ocr on #${media_id} at ${path}`)
    const worker = await createWorker('eng')
    const ret = await worker.recognize(path)
    await data.addOCRText(media_id, ret.data.text)
    await worker.terminate()
}

exports.ocr = {
    run: run
}