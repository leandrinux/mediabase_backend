import tf from '@tensorflow/tfjs-node'
import coco_ssd from '@tensorflow-models/coco-ssd'
import fs from 'node:fs/promises'
import data from '../data/index.js'
import msg from '../log.js'

const modelName = "mobilenet_v2"

var model
export async function initAI() {
    model = await coco_ssd.load({ base: modelName })
    msg.log(`Tensorflow model loaded`)
}

export default {

    generateTags: async (media, tempImagePath) => {

        if (media.media_type != 'image') {
            msg.dbg('Tensorflow AI object recognition is only supported in images')
            return
        }

        msg.dbg(`Running tensorflow on ${tempImagePath}`)        
        const image = await fs.readFile(tempImagePath)
        const imgTensor = tf.node.decodeImage(image, 3);
        const predictions = await model.detect(imgTensor, 3);
        
        const allTags = predictions.map(x => x.class)
        const uniqueTags = Array.from(new Set(allTags))
        uniqueTags.forEach(async tagName => { 
            data.tags.addTagToMedia(tagName, media)
        })
        if (uniqueTags.length>0) 
            msg.log(`Added tags: ${uniqueTags}`)
        else
            msg.log(`No AI tags were found`)

    }

}