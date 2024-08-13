const { data } = require('./data.js');
const tf = require("@tensorflow/tfjs-node")
const coco_ssd = require("@tensorflow-models/coco-ssd")
const fs = require('node:fs/promises');

var model = undefined

exports.AI = {

    generateTags: async (mediaId) => {
        const media = await data.getMedia(mediaId)
        if (!model) {
            model = await coco_ssd.load({ base: "mobilenet_v1" })
        }
        const absolutePath = `${global.mediabasePath}/${media.file_path}${media.file_name}`
        console.log(`[ ] Running tensorflow on ${absolutePath}`)        
        const image = await fs.readFile(absolutePath)
        const imgTensor = tf.node.decodeImage(image, 3);
        const predictions = await model.detect(imgTensor, 3);
        
        const allTags = predictions.map(x => x.class)
        const uniqueTags = Array.from(new Set(allTags))
        uniqueTags.forEach(async tagName => { 
            var tagObject = await data.getTagWithName(tagName)
            if (!tagObject) tagObject = await data.addTagWithName(tagName)
            media.addTag(tagObject)
        })
        if (uniqueTags.count) 
            console.log(`[ ] Added tags: ${uniqueTags}`)
        else
            console.log(`[ ] No AI tags were found`)
    }

}