const path = require('path')
const fs = require('fs')
const { data } = require('./data.js')
const { tasks } = require('./tasks.js')

exports.services = {

    initDatabase: async () => {
        console.log("[ ] Initializing database");
        await tasks.initDatabase()
    },

    getMedia: async (req, res) => {
        const photos = await data.getAll()
        res.json(photos);
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

    postMedia: async (req, res) => {
        if (!req.file) {
            res.status(400).json({message: "bad request"})
            console.log('bad postmedia request!')
            console.log(req)
            return
        }
        console.log('Adding new media')
        const media = await tasks.addMedia(req.file.filename, req.file.originalname)
        await tasks.saveMetadata(media.media_id, req.file.path)
        const filePath = await tasks.relocateMedia(media.media_id, req.file.path)
        tasks.makeThumbnail(media.media_id, filePath)
        tasks.runOCR(media.media_id, filePath)
        res.status(201).json({
            media_id: media.media_id,
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
            media_id: media.media_id,
            message: "success"
        })
    }

}