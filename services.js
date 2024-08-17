const path = require('path')
const fs = require('fs')
const { data } = require('./data.js')
const { tasks } = require('./tasks.js')
const { paths } = require('./paths.js')

exports.services = {

    initDatabase: async () => {
        await data.initDatabase()
    },

    getMedia: async (req, res) => {
        console.log('[ ] Service requested: getMedia')
        const mediaId = req.query.id
        if (!mediaId) {
            const media = await data.getAllMedia()
            res.json(media);
        } else {
            const media = await data.getMedia(mediaId)
            if (!media) {
                res.status(404).json({message: "not found"})
            } else {
                const tags = await media.getTags()
                const plain = media.get({ plain: true })
                plain.tags = tags.map(x => {return x.name}).sort()
                res.status(200).json(plain)
            }
        }
    },

    getMediaFile: async (req, res) => {
        console.log('[ ] Service requested: getMediaFile')
        if (!req.query.id) {
            res.status(400).json({message: "bad request"})
            return
        }
        const fullPath = await data.getFileFullPath(req.query.id)
        if ((!fullPath) || (!fs.existsSync(fullPath)))
            res.status(404).json({message: "not found"})
        else
            res.download(fullPath);
    },

    getMediaThumbnail: async (req, res) => {
        console.log('[ ] Service requested: getMediaThumbnail')
        if (!req.query.id) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await data.getMedia(req.query.id)
        if (!media) {
            res.status(404).json({message: "not found"})
            return            
        }
        const thumbnailPath = paths.getFullThumbnailPath(media)
        if (!fs.existsSync(thumbnailPath)) {
            res.status(404).json({message: "not found"})
            return
        } else
          res.download(thumbnailPath)
    },

    getTags: async (req, res) => {
        console.log('[ ] Service requested: getTags')
        const tags = await data.getTags()
        res.status(200).json(tags)
    },

    addMedia: async (req, res) => {
        console.log('[ ] Service requested: addMedia')
        if (!req.file) {
            res.status(400).json({message: "bad request"})
            return
        }

        // add the media entity with the original file
        const originalFilename = req.file.filename
        var media = await tasks.addMedia(originalFilename)
        const tempMediaPath = `${paths.getTemporaryPath()}/${originalFilename}`

        // extract and save metadata from media
        await tasks.saveMetadata(media, tempMediaPath)
        const finalMediaPath = await tasks.relocateMedia(media, tempMediaPath)
        media = await data.getMedia(media.id)

        await tasks.makeThumbnail(media)
        tasks.runOCR(media)
        tasks.generateAITags(media)
        console.log(`[ ] Media added successfully - other tasks may still be running`)
        res.status(201).json({
            id: media.id,
            message: "success"
        })    
    },

    deleteMedia: async (req, res) => {
        console.log('[ ] Service requested: deleteMedia')
        if (!req.query.id) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await data.getMedia(req.query.id)
        if (!media) {
            res.status(404).json({message: "not found"})
            return
        }
        const fullMediaPath = paths.getFullMediaPath(media)
        const fullThumbnailPath = paths.getFullThumbnailPath(media)
        await data.deleteMedia(req.query.id)
        fs.unlink(fullMediaPath, () => {} )
        fs.unlink(fullThumbnailPath, () => {} )
        res.status(201).json({
            id: media.id,
            message: "success"
        })
    },

    addTagToMedia: async (req, res) => {
        console.log('[ ] Service requested: addTagToMedia')
        const mediaId = req.query.mediaId
        const tagName = req.query.tagName
        if (!mediaId || !tagName) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await data.getMedia(mediaId)
        if (!media) {
            res.status(404).json({message: "not found"})
            return
        }
        var tag = await data.getTagWithName(tagName)
        if (!tag) tag = await data.addTagWithName(tagName)
        media.addTag(tag)
        tag.count = tag.count + 1
        await tag.save()
        res.status(201).json({
            message: "success"
        })
    },
    
    removeTagFromMedia: async (req, res) => {
        console.log('[ ] Service requested: removeTagFromMedia')
        const mediaId = req.query.mediaId
        const tagName = req.query.tagName
        if (!mediaId || !tagName) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await data.getMedia(mediaId)
        const tag = await data.getTagWithName(tagName)
        if (!media || !tag) {
            res.status(404).json({message: "not found"})
            return
        }
        media.removeTag(tag)
        tag.count = tag.count - 1
        tag.save()
        res.status(201).json({
            message: "success"
        })       
    }

}