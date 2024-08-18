import { createWorker } from 'tesseract.js'
import data from '../data/index.js'
import paths from '../paths.js'

export default {

    run: async (media) => {
        if (media.media_type != 'image') {
            console.log('[ ] Optical character recognition with tesseract is only supported in images')
            return
        }

        if (media.mime_type in ['image/heic', 'image/webp']) {
            console.log('[ ] HEIC and WEBP images are not suitable for optical character recognition with tesseract')
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