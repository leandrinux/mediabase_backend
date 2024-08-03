const path = require('path')
const fs = require('fs')
const { data } = require('./data.js')
const { tasks } = require('./tasks.js')

exports.services = {

    initDatabase: async () => {
        console.log("[ ] Initializing database");
        await data.initDatabase()
    },

    getMedia: async (req, res) => {
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
        if (!req.query.id) {
            res.status(400).json({message: "bad request"})
            return
        }       
        const fullPath = await data.getFileFullPath(req.query.id)
        if (!fullPath) {
            res.status(404).json({message: "not found"})
            return
        }
        const file = path.parse(fullPath)
        const thumbnailPath = `${file.dir}/thumbs/${file.name}.jpg`
        if (!fs.existsSync(thumbnailPath))
            res.status(404).json({message: "not found"})
        else
            res.download(thumbnailPath);
    },

    addMedia: async (req, res) => {
        if (!req.file) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await tasks.addMedia(req.file.filename, req.file.originalname)
        await tasks.saveMetadata(media.id, req.file.path)
        const filePath = await tasks.relocateMedia(media.id, req.file.path)
        await tasks.makeThumbnail(media.id, filePath)
        tasks.runOCR(media.id, filePath)
        tasks.autoTag(media.id)
        console.log(`Media added successfully - other tasks may still be running`)
        res.status(201).json({
            id: media.id,
            message: "success"
        })    
    },

    deleteMedia: async (req, res) => {
        if (!req.query.id) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await data.getMedia(req.query.id)
        if (!media) {
            res.status(404).json({message: "not found"})
            return
        }
        const fullFilePath = `${media.file_path}${media.file_name}`
        const fullThumbnailPath = `${media.file_path}thumbs/${media.file_name}`
        await data.deleteMedia(req.query.id)
        fs.unlink(fullFilePath, () => {} )
        fs.unlink(fullThumbnailPath, () => {} )
        res.status(201).json({
            id: media.id,
            message: "success"
        })
    },

    addTagToMedia: async (req, res) => {
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
        res.status(201).json({
            message: "success"
        })
    },
    
    removeTagFromMedia: async (req, res) => {
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
        res.status(201).json({
            message: "success"
        })       
    }

}