import models from './models.js'

export default {

    addQRWithData: async (id, data) => {
        return await models.QR.create({ 
            mediaId: id,
            value: data
        })
    },

    getQRMedia: async () => {
        const qrs = await models.QR.findAll({
            attributes: [ 'mediaId', 'value' ]
        })

        return qrs
    }

}