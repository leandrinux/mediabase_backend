import paths from '../paths.js'
import crypto from 'crypto'
import fs from 'fs'
import msg from '../log.js'

async function calculate(path) {
    const hash = crypto.createHash('sha256')
    const stream = fs.createReadStream(path)
    return new Promise((resolve, reject) => {
        stream.on("data", chunk => { 
            hash.update(chunk) 
        })
        stream.on("end", () => {
            const result = hash.digest('base64')
            resolve(result)
        });
        stream.on("error", error => reject(error));
    })
}

export default async function sha256(media) {
    const originalMediaPath = paths.getFullMediaPath(media)
    const result = await calculate(originalMediaPath)
    msg.dbg(`${media.file_name} sha256 is ${result}`)
    media.sha256 = result
    await media.save()
}