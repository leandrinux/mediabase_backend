const im = require('imagemagick')
const PATH = require("path")
const { data } = require('./data.js');

function make(photo_id, path) {
    console.log(`Making thumbnail for photo ${photo_id} at ${path}`)
    let thumb_name = `${PATH.parse(path).name}.jpg`
    let thumb_path = `thumbnails/${thumb_name}`
    im.resize({
        srcPath: path,
        srcFormat: "heic",
        dstPath: thumb_path,
        format: 'jpg',
        width: 300
    }), (err, stdout, stderr) => {
        if (err) throw err;
        console.log(stderr)
    }
    data.addThumbnail(photo_id, thumb_name)
}

exports.thumbnails = {
    make: make
}