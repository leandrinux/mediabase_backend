import models from './models.js'

export default {

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