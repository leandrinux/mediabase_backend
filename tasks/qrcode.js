import fs from 'node:fs/promises'
import paths from '../paths.js'
import { resizeImageAsync } from './images.js'
import jsQR from 'jsqr'
import Jimp from 'jimp'
import data from '../data/index.js'

async function scan(filePath) {
    const imageData = await fs.readFile(filePath)
    const image = await Jimp.read(imageData)
    var results = []
    var code = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)
    while (code) {
        results.push(code)
        let x1 = Math.min(...[code.location.topRightCorner.x, code.location.topLeftCorner.x, code.location.bottomRightCorner.x, code.location.bottomLeftCorner.x])
        let y1 = Math.min(...[code.location.topRightCorner.y, code.location.topLeftCorner.y, code.location.bottomRightCorner.y, code.location.bottomLeftCorner.y])
        let x2 = Math.max(...[code.location.topRightCorner.x, code.location.topLeftCorner.x, code.location.bottomRightCorner.x, code.location.bottomLeftCorner.x])
        let y2 = Math.max(...[code.location.topRightCorner.y, code.location.topLeftCorner.y, code.location.bottomRightCorner.y, code.location.bottomLeftCorner.y])
        let w = x2 - x1
        let h = y2 - y1
        image.scan(x1, y1, w, h, function (x, y, idx) {
            this.bitmap.data[idx] = 0
            this.bitmap.data[idx+1] = 0
            this.bitmap.data[idx+2] = 0
            this.bitmap.data[idx+3] = 0
        })
        code = jsQR(image.bitmap.data, image.bitmap.width, image.bitmap.height)
    }
    return results
}

export default async function scanQR(media) {

    if (media.media_type != 'image') {
        console.log('[ ] QR code scanning is only supported in images')
        return
    }
    const originalMediaPath = paths.getFullMediaPath(media)
    const tempFilePath = `${paths.getRandomTempFilePath()}.jpg`
    console.log(`[ ] Converting image format to ${tempFilePath}`)
    await resizeImageAsync(originalMediaPath, tempFilePath)
    console.log(`[ ] Scanning for QR codes on ${tempFilePath}`)
    const codes = await scan(tempFilePath)
    console.log(`[ ] Found ${codes.length} QR codes`)
    codes.forEach(async code => {
        const codeModel = data.models.QR.build({ 
            mediaId: media.id,
            value: code.data
        })
        await codeModel.save()
    })
    await fs.unlink(tempFilePath, () => {} )
}