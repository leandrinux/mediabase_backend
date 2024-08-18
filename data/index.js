import { Sequelize } from 'sequelize'
import models from './models.js'
import paths from '../paths.js'

/*
const { Sequelize } = require("sequelize")
const { models } = require("./models.js")
const { paths } = require('../paths.js')
*/

export default {
    models: models,

    addMedia: async (mediaFilename) => {
        return await models.Media.create({
            file_name: mediaFilename,
            file_path: paths.getTemporaryPath()
        })
    },

    addExifData: async (mediaId, data) => {
        await models.Media.update({
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
        await models.Media.update({ 
            OCR: OCR
        },{ 
            where: { id: mediaId }
        })
    },

    getAllMedia: async () => {
        try {
            return await models.Media.findAll({
                attributes: ['id', 'latitude', 'longitude'],
                order: [ ['date', 'DESC'] ]
            })
        } catch (error) {
            return []
        }
    },

    getMedia: async (mediaId) => {
        try {
            return await models.Media.findByPk(mediaId)
        } catch (error) {
        }
    },

    getTags: async () => {
        try {
            return await models.Tag.findAll({
                attributes: ['id', 'name', 'count'],
                order: [ ['name', 'ASC'] ]
            })
        } catch (error) {
            return []
        }
    },

    getFileName: async (mediaId) => {
        try {
            const media = await models.Media.findByPk(mediaId)
            return media?.file_name
        } catch (error) {
        }
    },

    setFileName: async (mediaId, fileName) => {
        await models.Media.update({ 
            file_name: fileName
        },{ 
            where: { id: mediaId }
        })
    },

    getMimeType: async (mediaId) => {
        try {
            const media = await models.Media.findByPk(mediaId)
            return media?.mime_type
        } catch (error) {
        }
    },

    getFileFullPath: async (mediaId) => {
        try {
            const media = await models.Media.findByPk(mediaId)
            if (media) return paths.getFullMediaPath(media)
        } catch (error) {
        }
    },

    deleteMedia: async (mediaId) => {
        await models.Media.destroy({
            where: { id: mediaId }
        })
    },

    getTagWithName: async (tagName) => {
        return await models.Tag.findOne({ where: { name: tagName } })
    },

    addTagWithName: async (tagName) => {
        return await models.Tag.create({ name: tagName })
    }

}