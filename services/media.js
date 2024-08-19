import data from '../data/index.js'
import tasks from '../tasks/index.js'
import paths from '../paths.js'
import fs from 'fs'

export default {

    getMedia: async (req, res) => {
        console.log('[ ] Service requested: getMedia')
        var media
        if (req.query.tags) {
            media = await data.getMediaByTags(req.query.tags)
        } else {
            media = await data.getAllMedia()
        }
        res.json(media);
    },

    getMediaById: async (req, res) => {
        console.log('[ ] Service requested: getMediaById')
        const media = await data.getMedia(req.params.mediaId)
        if (!media) {
            res.status(404).json({message: "not found"})
        } else {
            const tags = await media.getTags()
            const plain = media.get({ plain: true })
            plain.tags = tags.map(x => {return x.name}).sort()
            res.status(200).json(plain)
        }
    },

    getMediaByTags: async (req, res) => {
        console.log('[ ] Service requested: getMediaByTags')
        res.status(200).json(mediaIds)
    },
    
    getMediaFile: async (req, res) => {
        console.log('[ ] Service requested: getMediaFile')
        const fullPath = await data.getFileFullPath(req.params.mediaId)
        if ((!fullPath) || (!fs.existsSync(fullPath)))
            res.status(404).json({message: "not found"})
        else
            res.download(fullPath);
    },

    getMediaPreview: async (req, res) => {
        console.log('[ ] Service requested: getMediaPreview')
        const media = await data.getMedia(req.params.mediaId)
        if (!media) {
            res.status(404).json({message: "not found"})
            return            
        }
        const previewPath = paths.getFullPreviewPath(media)
        if (!fs.existsSync(previewPath)) {
            res.status(404).json({message: "not found"})
            return
        } else
          res.download(previewPath)
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

        await tasks.makePreview(media)
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

        // decrement the tag counters
        const tagsPerMedia = await data.models.TagsPerMedia.findAll({
            where: { mediaId: media.id }
        })
        tagsPerMedia.forEach(async entry => {
            const tag = await data.models.Tag.findOne({
                where: { id: entry.tagId }
            })
            tag.count = tag.count - 1
            tag.save()
        })

        // delete the files
        const fullMediaPath = paths.getFullMediaPath(media)
        const fullPreviewPath = paths.getFullPreviewPath(media)

        // delete the media entry from the database
        await data.deleteMedia(req.query.id)
        fs.unlink(fullMediaPath, () => {} )
        fs.unlink(fullPreviewPath, () => {} )

        res.status(201).json({
            id: media.id,
            message: "success"
        })
    },

}

