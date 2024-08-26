import models from './models.js'
import paths from '../paths.js'

export default {

    addMedia: async (mediaFilename) => {
        return await models.Media.create({
            file_name: mediaFilename,
            file_path: paths.getTemporaryPath()
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

    addExifData: async (mediaId, exif) => {

        await models.Media.update({
            file_path: exif.filePath,
            mime_type: exif.mimeType,
            media_type: exif.mediaType,
            width: exif.width,
            height: exif.height,
            date: exif.createDate
        },{ 
            where: { id: mediaId }
        })

        if ((exif.latitude) && (exif.longitude)) {
            await models.Location.create({
                mediaId: mediaId,
                latitude: exif.latitude,
                longitude: exif.longitude
            })    
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

}