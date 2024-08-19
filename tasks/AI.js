import tf from '@tensorflow/tfjs-node'
import coco_ssd from '@tensorflow-models/coco-ssd'
import fs from 'node:fs/promises'
import data from '../data/index.js'
import paths from '../paths.js'
import { resizeImageAsync } from './images.js'

const modelName = "mobilenet_v2"

var model

export default {

    generateTags: async (media) => {

        if (media.media_type != 'image') {
            console.log('[ ] Tensorflow AI object recognition is only supported in images')
            return
        }

        if (!model) {
            console.log(`[ ] Loading tensorflow model ${modelName}`)
            model = await coco_ssd.load({ base: modelName })
        }

        const originalMediaPath = paths.getFullMediaPath(media)
        const tempFilePath = `${paths.getRandomTempFilePath()}.jpg`
        console.log(`[ ] Converting image format to ${tempFilePath}`)
        await resizeImageAsync(originalMediaPath, tempFilePath)

        console.log(`[ ] Running tensorflow on ${tempFilePath}`)        
        const image = await fs.readFile(tempFilePath)
        const imgTensor = tf.node.decodeImage(image, 3);
        const predictions = await model.detect(imgTensor, 3);
        
        const allTags = predictions.map(x => x.class)
        const uniqueTags = Array.from(new Set(allTags))
        uniqueTags.forEach(async tagName => { 
            var tag = await data.getTagWithName(tagName)
            if (!tag) {
                tag = await data.addTagWithName(tagName)
            }
            await media.addTag(tag)
            tag.count = tag.count + 1
            await tag.save()
        })
        if (uniqueTags.length>0) 
            console.log(`[ ] Added tags: ${uniqueTags}`)
        else
            console.log(`[ ] No AI tags were found`)

        await fs.unlink(tempFilePath, () => {} )
    }

}