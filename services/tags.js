import data from '../data/index.js'
import msg from '../log.js'

export default {

    getTags: async (req, res) => {
        msg.dbg('Service requested: getTags')
        const tags = await data.getTags()
        res.status(200).json(tags)
    },
    
    deleteTag: async (req, res) => {
        msg.dbg('Service requested: deleteTag')
        const tagName = req.params.tagName
        const tag = await data.getTagByName(tagName)
        if (!tag) {
            res.status(404).json({message: "not found"})
            return
        }
        tag.destroy()
        res.status(201).json({ message: "success" })
    },
    
    addTagToMedia: async (req, res) => {
        msg.dbg('Service requested: addTagToMedia')
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
        data.addTagToMedia(tagName, media)
        res.status(201).json({
            message: "success"
        })
    },
    
    removeTagFromMedia: async (req, res) => {
        msg.dbg('Service requested: removeTagFromMedia')
        const mediaId = req.params.mediaId
        const tagName = req.params.tagName
        if (!mediaId || !tagName) {
            res.status(400).json({message: "bad request"})
            return
        }
        const media = await data.getMedia(mediaId)
        const tag = await data.getTagByName(tagName)
        if (!media || !tag) {
            res.status(404).json({message: "not found"})
            return
        }
        const tagPerMedia = await data.getTagPerMedia(tag.id, media.id)
        if (!tagPerMedia) {
            res.status(404).json({message: "media does not have that tag"})
            return
        }
        media.removeTag(tag)
        if (tag.count > 1) {
            tag.count = tag.count - 1
            tag.save()
        } else {
            tag.destroy()
        }
        res.status(201).json({ message: "success" })       
    }

}

