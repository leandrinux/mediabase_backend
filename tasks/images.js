import gm from 'gm'

export async function resizeImageAsync(srcPath, dstPath, side) {
    return new Promise((resolve, reject) => {
        gm(srcPath)
            .autoOrient()
            .resize(side, side, '^')
            .write(dstPath, (err) => {
                if (err) reject(err) 
                else resolve()
            })
    })
}
