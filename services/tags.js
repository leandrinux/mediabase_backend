const { data } = require('../data')

exports.tags = {

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
        res.status(201).json({
            message: "success"
        })       
    }

}

