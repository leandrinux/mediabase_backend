import fs from 'node:fs/promises'
import jsQR from 'jsqr'
import Jimp from 'jimp'
import data from '../data/index.js'
import msg from '../log.js'

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

export default async function scanQR(media, tempImagePath) {

    if (media.media_type != 'image') {
        msg.warn('QR code scanning is only supported in images')
        return
    }
    msg.dbg(`Scanning for QR codes on ${tempImagePath}`)
    const codes = await scan(tempImagePath)
    msg.dbg(`Found ${codes.length} QR codes`)
    codes.forEach(async code => {
        await data.addQRWithData(media.id, code.data)
    })
    msg.log(`QR scan completed successfully`)
}