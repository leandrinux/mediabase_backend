import data from '../data/index.js'

export default {

    getTags: async (req, res) => {
        console.log('[ ] Service requested: getTags')
        const tags = await data.getTags()
        res.status(200).json(tags)
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
        const mediaId = req.params.mediaId
        const tagName = req.params.tagName
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
        const tagPerMedia = await data.models.TagsPerMedia.findOne({
            where : { tagId: tag.id, mediaId: media.id }
        })
        if (!tagPerMedia) {
            res.status(404).json({message: "media does not have that tag"})
            return
        }
        media.removeTag(tag)
        tag.count = tag.count - 1
        tag.save()
        res.status(201).json({ message: "success" })       
    }

}

