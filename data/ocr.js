import models from './models.js'

export default {

    addOCRText: async (mediaId, words) => {
        return await models.OCR.create({ 
            mediaId: mediaId,
            words: words
        })
    },

}