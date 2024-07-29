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
        const fullPath = await data.getFileFullPath(req.query.id)
        if (!fullPath) res.status(404).json({message: "not found"})
        else res.download(fullPath);
    },

    getMediaThumbnail: async (req, res) => {
        const fullPath = await data.getFileFullPath(req.query.id)
        if (!fullPath) res.status(404).json({message: "not found"})
        else {
            const file = path.parse(fullPath)
            const thumb = `${file.dir}/thumbs/${file.name}.jpg`
            res.download(thumb);
        }   
    },

    postMedia: async (req, res) => {
        if (!req.file) res.status(400).json({message: "bad request"})
        else {
            const photo = await tasks.addMedia(req.file.filename, req.file.originalname)
            await tasks.saveMetadata(photo.media_id, req.file.path)
            const filePath = await tasks.relocateMedia(photo.media_id, req.file.path)
            tasks.makeThumbnail(photo.media_id, filePath)
            tasks.runOCR(photo.media_id, filePath)
            res.status(201).json({
                media_id: photo.media_id,
                message: "success"
            })    
        }
    }

}