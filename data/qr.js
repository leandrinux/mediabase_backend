import models from './models.js'

export default {

    addQRWithData: async (id, data) => {
        return await models.QR.create({ 
            mediaId: id,
            value: data
        })
    }

}