import models from './models.js'
import media from './media.js'
import tags from './tags.js'
import qr from './qr.js'
import ocr from './ocr.js'

export async function initData() {
    await models.init()
}

export default {
    media: media,
    tags: tags,
    qr: qr,
    ocr: ocr
}