import { Sequelize } from 'sequelize'
import models from './models.js'
import paths from '../paths.js'

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
            media_type: data.mediaType,
            width: data.width,
            height: data.height,
            date: data.createDate,
            latitude: data.latitude,
            longitude: data.longitude
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
        const media = await models.Media.findAll({
            attributes: [ 'id' ],
            order: [ ['date', 'DESC'] ]
        })
        return media.map(x => { return x.id })
    },

    getMedia: async (mediaId) => {
        try {
            return await models.Media.findByPk(mediaId)
        } catch (error) {
        }
    },

    getMediaByTags: async (tagNameString) => {
        const tagNames = tagNameString.split(',')
        const tags = await models.Tag.findAll({
            attributes: [ 'id' ],
            where: { name: tagNames }
        })
        const tagIds = tags.map(x => { return x.id })
        const media = await models.TagsPerMedia.findAll({
            attributes: [ 'mediaId' ],
            where: { tagId: tagIds }
        })
        const mediaIds = media.map(x => { return x.mediaId })
        return mediaIds
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
    },

    addTagToMedia: async (tagName, media) => {
        var tag = await models.Tag.findOne({ where: { name: tagName } })
        if (!tag) tag = await models.Tag.create({ name: tagName })
        media.addTag(tag)
        tag.count = tag.count + 1
        await tag.save()
    }

}