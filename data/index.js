import models from './models.js'
import paths from '../paths.js'

export default {

    init: models.init,

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
            attributes: [ 'id', 'media_type' ],
            order: [ ['date', 'DESC'] ]
        })
        return media
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
        const mediaIds = await models.TagsPerMedia.findAll({
            attributes: [ 'mediaId' ],
            where: { tagId: tagIds }
        })
        const mediaIdsList = mediaIds.map(x => { return x.mediaId })
        const media = await models.Media.findAll({
            attributes: [ 'id', 'media_type' ],
            where: { id: mediaIdsList }
        })
        return media
    },

    getTagsByMedia: async (mediaId) => {
        return await models.TagsPerMedia.findAll({
            where: { mediaId: mediaId }
        })
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

    getTagById: async (tagId) => {
        return await models.Tag.findOne({
            where: { id: tagId }
        })
    },

    getTagByName: async (tagName) => {
        return await models.Tag.findOne({ where: { name: tagName } })
    },

    getTagPerMedia: async (tagId, mediaId) => {
        return await models.TagsPerMedia.findOne({
            where : { tagId: tagId, mediaId: mediaId }
        })
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

    addTagWithName: async (tagName) => {
        return await models.Tag.create({ name: tagName })
    },

    addQRWithData: async (id, data) => {
        return await models.QR.create({ 
            mediaId: id,
            value: data
        })
    },

    addTagToMedia: async (tagName, media) => {
        var tag = await models.Tag.findOne({ where: { name: tagName } })
        if (!tag) tag = await models.Tag.create({ name: tagName })
        media.addTag(tag)
        tag.count = tag.count + 1
        await tag.save()
    }

}