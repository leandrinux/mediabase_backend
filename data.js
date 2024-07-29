const util = require("util");
const { Models } = require("./data_models.js");
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
        mime_type: data.mimeType,
        width: data.width,
        height: data.height,
        creation_date: data.createDate,
        latitude: data.latitude,
        longitude: data.latitude
    },{ 
        where: { media_id: media_id }
    })
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
        if (media) return `${media.file_path}${media.file_name}`
    } catch (error) {
    }
}

async function getMimeType(mediaId) {
    try {
        const media = await Models.Media.findByPk(mediaId)
        return media?.mime_type
    } catch (error) {
    }
}

exports.data = {
    initDatabase: Models.initDatabase,
    addMedia: addMedia,
    addExifData: addExifData,
    addOCRText: addOCRText,
    getAll: getAll,
    getFileName: getFileName,
    setFileName: setFileName,
    getMimeType: getMimeType,
    getFileFullPath: getFileFullPath
}