import { createWorker } from 'tesseract.js'
import data from '../data/index.js'
import paths from '../paths.js'

export default {

    run: async (media) => {
        const mimeType = media.mime_type
        if (mimeType == 'image/heic') {
            console.log('[ ] HEIC images are not suitable for OCR with tesseract')
            return
        }
        const path = paths.getFullMediaPath(media)
        console.log(`[ ] Running OCR on ${path}`)
        const worker = await createWorker('eng')
        const ret = await worker.recognize(path)
        await data.addOCRText(media.id, ret.data.text)
        await worker.terminate()
    }

}