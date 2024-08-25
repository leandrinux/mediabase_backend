import data from '../data/index.js'
import tasks from '../tasks/index.js'
import paths from '../paths.js'
import fs from 'fs'
import { resizeImageAsync } from '../tasks/images.js'
import msg from '../log.js'
import exif from '../exiftool.js'

const acceptedMimeTypes = new Set([
    "image/jpeg", "image/png", "image/heic", "image/webp",
    "video/mp4", "video/quicktime"
])

export default {

    addMedia: async (req, res) => {
        msg.dbg('Service requested: addMedia')
        if (!req.file) {
            res.status(400).json({message: "bad request"})
            return
        }

        const originalFilename = req.file.filename
        const tempMediaPath = `${paths.getTemporaryPath()}/${originalFilename}`
        var metadata
        try {
            metadata = await exif.run(tempMediaPath)
        } catch (error) {
        }

        if (!metadata) {
            res.status(404).json({message: "invalid file"})
            return
        }

        if (!acceptedMimeTypes.has(metadata.mimeType)) {
            msg.log(`Got unsupported mimetype ${metadata.mimeType}`)
            res.status(404).json({message: "unsupported mime type"})
            return
        }

        // create the media object in the current temp position
        var media = await tasks.addMedia(originalFilename)

        // save the metadata
        await tasks.saveMetadata(media, metadata)

        // move the media object to its proper location
        const finalMediaPath = await tasks.relocateMedia(media, tempMediaPath)

        // refresh the media object
        media = await data.media.getMedia(media.id)

        // perform the remaining tasks
        await tasks.makePreview(media)
        await tasks.autoTag(media)
        msg.log(`Media added successfully`)

        // if it's an image there are a few more things to do
        if (media.media_type = 'image') {
            tasks.runOCR(media)

            const originalMediaPath = paths.getFullMediaPath(media)
            const tempImagePath = `${paths.getRandomTempFilePath()}.jpg`
            msg.dbg(`Creating temp image ${tempImagePath}`)
            await resizeImageAsync(originalMediaPath, tempImagePath)   

            await tasks.scanQR(media, tempImagePath)
            await tasks.generateAITags(media, tempImagePath)

            msg.dbg(`Deleting temp image ${tempImagePath}`)
            fs.unlink(tempImagePath, () => {} )
        }

        res.status(201).json({
            id: media.id,
            message: "success"
        })    
    },

    getMedia: async (req, res) => {
        msg.dbg('Service requested: getMedia')
        var media
        if (req.query.tags) {
            media = await data.media.getMediaByTags(req.query.tags)
        } else {
            media = await data.media.getAllMedia()
        }
        res.json(media);
    },

    getMediaById: async (req, res) => {
        msg.dbg('Service requested: getMediaById')
        const media = await data.media.getMedia(req.params.mediaId)
        if (!media) {
            res.status(404).json({message: "not found"})
        } else {
            const tags = await media.getTags()
            const plain = media.get({ plain: true })
            plain.tags = tags.map(x => {return x.name}).sort()
            res.status(200).json(plain)
        }
    },
    
    getMediaFile: async (req, res) => {
        msg.dbg('Service requested: getMediaFile')
        const fullPath = await data.media.getFileFullPath(req.params.mediaId)
        if ((!fullPath) || (!fs.existsSync(fullPath)))
            res.status(404).json({message: "not found"})
        else
            res.download(fullPath);
    },

    getMediaPreview: async (req, res) => {
        msg.dbg('Service requested: getMediaPreview')
        const media = await data.media.getMedia(req.params.mediaId)
        if (!media) {
            res.status(404).json({message: "not found"})
            return            
        }
        const previewPath = paths.getFullPreviewPath(media, req.query.animated != undefined)
        if (!fs.existsSync(previewPath)) {
            res.status(404).json({message: "not found"})
            return
        } else
          res.download(previewPath)
    },

    deleteMedia: async (req, res) => {
        const mediaId = req.params.mediaId
        msg.dbg('Service requested: deleteMedia')
        const media = await data.media.getMedia(mediaId)
        if (!media) {
            res.status(404).json({message: "not found"})
            return
        }

        // decrement the tag counters
        const tagsPerMedia = await data.tags.getTagsByMedia(media.id)

        tagsPerMedia.forEach(async entry => {
            const tag = await data.tags.getTagById(entry.tagId)
            if (tag.count > 1) { 
                tag.count = tag.count - 1
                tag.save()
            } else {
                tag.destroy()
            }
        })

        // delete the media entry from the database
        await data.media.deleteMedia(mediaId)

        // delete the files
        const fullMediaPath = paths.getFullMediaPath(media)
        const fullPreviewPath = paths.getFullPreviewPath(media)
        fs.unlink(fullMediaPath, () => {} )
        fs.unlink(fullPreviewPath, () => {} )

        res.status(201).json({
            id: media.id,
            message: "success"
        })
    },

}