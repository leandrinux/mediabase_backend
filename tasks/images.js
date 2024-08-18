import im from 'imagemagick'

export async function resizeImageAsync(srcPath, dstPath, width) {
    return new Promise((resolve, reject) => {
        im.resize({
            srcPath: srcPath,
            dstFormat: 'jpg',
            dstPath: dstPath,
            width: width
        }, (err, stdout, stderr) => {
            if (err) reject(err)
            else resolve()
        })        
    })
}