const util = require("util");
const { Models } = require("./models.js");
const { Sequelize } = require("sequelize");

async function addMedia(filename) {
    return await Models.Media.create({
        file_name: filename,
        file_path: 'temp/'
    })
}

async function addExifData(media_id, data) {
    await Models.Media.update({
        file_path: data.filePath,
        media_creation_date: data.createDate,
        latitude: data.latitude,
        longitude: data.latitude
    },{ 
        where: { media_id: media_id }
    })
}

async function addThumbnail(media_id, thumb_name) {
    await Models.Media.update(
        { thumb: thumb_name },
        { where: { media_id: media_id }}
    )
}

async function addOCRText(media_id, OCR) {
    await Models.Media.update({ 
        OCR: OCR
    },{ 
        where: { media_id: media_id }
    })
}

async function getAll() {
    try {
        return await Models.Media.findAll({
            attributes: [
                'media_id', 
                'latitude', 
                'longitude'
            ]
        })
    } catch (error) {
        return []
    }
}

async function getFileName(mediaId) {
    try {
        const media = await Models.Media.findByPk(mediaId)
        return media?.file_name
    } catch (error) {
    }
}

async function setFileName(mediaId, fileName) {
    await Models.Media.update({ 
        file_name: fileName
    },{ 
        where: { media_id: mediaId }
    })
}

async function getFileFullPath(media_id) {
    try {
        const media = await Models.Media.findByPk(media_id)
        return `${media?.file_path}${media?.file_name}`
    } catch (error) {
    }
}

async function getThumb(media_id) {
    try {
        const media = await Models.Media.findByPk(media_id)
        return media?.thumb
    } catch (error) {
    }
}

async function initDatabase() {
    await Models.init()
}

exports.data = {
    initDatabase: initDatabase,
    addMedia: addMedia,
    addExifData: addExifData,
    addThumbnail: addThumbnail,
    addOCRText: addOCRText,
    getAll: getAll,
    getFileName: getFileName,
    setFileName: setFileName,
    getFileFullPath: getFileFullPath,
    getThumb: getThumb
}