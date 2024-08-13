const { createWorker } = require('tesseract.js');
const { data } = require('./data.js')

exports.ocr = {

    run: async (mediaId, path) => {
        const mimeType = await data.getMimeType(mediaId)
        if (mimeType == 'image/heic') {
            console.log('[ ] HEIC images are not suitable for OCR with tesseract')
            return
        }

        console.log(`[ ] Running OCR on #${mediaId} at ${path}`)
        const worker = await createWorker('eng')
        const ret = await worker.recognize(path)
        await data.addOCRText(mediaId, ret.data.text)
        await worker.terminate()
    }

}