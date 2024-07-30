const util = require("util");
const { Models } = require("./data_models.js");
const { Sequelize } = require("sequelize");

exports.data = {
    initDatabase: Models.initDatabase,

    addMedia: async (filename) => {
        return await Models.Media.create({
            file_name: filename,
            file_path: 'temp/'
        })
    },

    addExifData: async (media_id, data) => {
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
    },

    addOCRText: async (media_id, OCR) => {
        await Models.Media.update({ 
            OCR: OCR
        },{ 
            where: { media_id: media_id }
        })
    },

    getAll: async () => {
        try {
            return await Models.Media.findAll({
                attributes: ['media_id', 'latitude', 'longitude']
            })
        } catch (error) {
            return []
        }
    },

    getMedia: async (mediaId) => {
        try {
            return await Models.Media.findByPk(mediaId)
        } catch (error) {
        }
    },

    getFileName: async (mediaId) => {
        try {
            const media = await Models.Media.findByPk(mediaId)
            return media?.file_name
        } catch (error) {
        }
    },

    setFileName: async (mediaId, fileName) => {
        await Models.Media.update({ 
            file_name: fileName
        },{ 
            where: { media_id: mediaId }
        })
    },

    getMimeType: async (mediaId) => {
        try {
            const media = await Models.Media.findByPk(mediaId)
            return media?.mime_type
        } catch (error) {
        }
    },

    getFileFullPath: async (media_id) => {
        try {
            const media = await Models.Media.findByPk(media_id)
            if (media) return `${media.file_path}${media.file_name}`
        } catch (error) {
        }
    },

    deleteMedia: async (mediaId) => {
        await Models.Media.destroy({
            where: { media_id: mediaId }
        })
    },

}