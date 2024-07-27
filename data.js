const util = require("util");
const { Media } = require("./models.js");

async function addMedia(filename) {
    return await Media.create({
        file_name: filename
    })
}

async function addExifData(media_id, data) {
    await Media.update({ 
        latitude: data.latitude,
        longitude: data.latitude
    },{ 
        where: { media_id: media_id }
    })
}

async function addThumbnail(media_id, thumb_name) {
    await Media.update(
        { thumb: thumb_name },
        { where: { media_id: media_id }}
    )
}

async function addOCRText(media_id, OCR) {
    await Media.update({ 
        OCR: OCR
    },{ 
        where: { media_id: media_id }
    })
}

async function getAll() {
    return await Media.findAll({
        attributes: [
            'media_id', 
            'latitude', 
            'longitude'
        ],
    })
}

async function getFileName(media_id) {
    const media = await Media.findByPk(media_id)
    return media?.file_name
}

async function getThumb(media_id) {
    const media = await Media.findByPk(media_id)
    return media?.thumb
}

exports.data = {
    addMedia: addMedia,
    addExifData: addExifData,
    addThumbnail: addThumbnail,
    addOCRText: addOCRText,
    getAll: getAll,
    getFileName: getFileName,
    getThumb: getThumb
}