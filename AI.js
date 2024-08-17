const { data } = require('./data.js');
const tf = require("@tensorflow/tfjs-node")
const coco_ssd = require("@tensorflow-models/coco-ssd")
const fs = require('node:fs/promises');
const { paths } = require("./paths.js")

const modelName = "mobilenet_v2"
var model = undefined

exports.AI = {

    generateTags: async (media) => {
        if (media.mime_type == 'image/heic') {
            console.log('[ ] HEIC images are not suitable for AI object recognition with tensorflow')
            return
        }
        
        if (!model) {
            console.log(`[ ] Loading tensorflow model ${modelName}`)
            model = await coco_ssd.load({ base: "mobilenet_v2" })
        }
        
        const fullMediaPath = paths.getFullMediaPath(media)
        console.log(`[ ] Running tensorflow on ${fullMediaPath}`)        
        const image = await fs.readFile(fullMediaPath)
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