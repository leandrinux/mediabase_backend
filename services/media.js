import data from '../data/index.js'
import tasks from '../tasks/index.js'
import paths from '../paths.js'
import fs from 'fs'
import { resizeImageAsync } from '../tasks/images.js'
import msg from '../log.js'
import exif from '../exiftool.js'
import { supportedTypes } from '../tasks/exif.js'

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
            msg.warn(`${originalFilename} caused exiftool exception ${error}`)
        }

        const fileIsInvalid = metadata == undefined
        const mimeTypeIsUnsupported = (metadata) ? !supportedTypes.has(metadata.mimeType) : true

        if (fileIsInvalid || mimeTypeIsUnsupported) {
            if (fileIsInvalid) 
                msg.err(`${originalFilename} is invalid because metadata could not be extracted`)
            else if (mimeTypeIsUnsupported) 
                msg.err(`${originalFilename} mimeType '${metadata.mimeType}' is not supported`)
            res.status(400).json({message: "file is invalid or unsupported"})
            fs.unlink(tempMediaPath, () => {} )
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

        // Generate the preview. Opening the file for this purpose
        // can generate an exception if the file is corrupted, so it is
        // handled.
        var passesPreviewGeneration = false
        try {
            await tasks.makePreview(media)
            passesPreviewGeneration = true
        } catch (error) {
        }
        if (!passesPreviewGeneration) {
            msg.err(`${originalFilename} preview could not be generated - is file corrupted? Removed`)
            res.status(400).json({message: "file is invalid or unsupported"})
            fs.unlink(finalMediaPath, () => {} )
            media.destroy()
            return
        }

        // perform the remaining tasks
        await tasks.autoTag(media)
        msg.success(`${media.file_name} added`)

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