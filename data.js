const { Models } = require("./data_models.js")
const { Sequelize } = require("sequelize")
const { paths } = require('./paths.js')

exports.data = {
    initDatabase: Models.initDatabase,

    addMedia: async (mediaFilename) => {
        return await Models.Media.create({
            file_name: mediaFilename,
            file_path: paths.getTemporaryPath()
        })
    },

    addExifData: async (mediaId, data) => {
        await Models.Media.update({
            file_path: data.filePath,
            mime_type: data.mimeType,
            width: data.width,
            height: data.height,
            date: data.createDate,
            latitude: data.latitude,
            longitude: data.latitude
        },{ 
            where: { id: mediaId }
        })
    },

    addOCRText: async (mediaId, OCR) => {
        await Models.Media.update({ 
            OCR: OCR
        },{ 
            where: { id: mediaId }
        })
    },

    getAllMedia: async () => {
        try {
            return await Models.Media.findAll({
                attributes: ['id', 'latitude', 'longitude'],
                order: [ ['date', 'DESC'] ]
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

    getTags: async () => {
        try {
            return await Models.Tag.findAll({
                order: [ ['name', 'ASC'] ]
            })
        } catch (error) {
            return []
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
            where: { id: mediaId }
        })
    },

    getMimeType: async (mediaId) => {
        try {
            const media = await Models.Media.findByPk(mediaId)
            return media?.mime_type
        } catch (error) {
        }
    },

    getFileFullPath: async (mediaId) => {
        try {
            const media = await Models.Media.findByPk(mediaId)
            if (media) return paths.getFullMediaPath(media)
        } catch (error) {
        }
    },

    deleteMedia: async (mediaId) => {
        await Models.Media.destroy({
            where: { id: mediaId }
        })
    },

    getTagWithName: async (tagName) => {
        return await Models.Tag.findOne({ where: { name: tagName } })
    },

    addTagWithName: async (tagName) => {
        return await Models.Tag.create({ name: tagName })
    }

}