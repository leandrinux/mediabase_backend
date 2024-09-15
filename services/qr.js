import data from '../data/index.js'
import msg from '../log.js'

export default {

    getMedia: async (req, res) => {
        msg.dbg('Service requested: get QR media')
        const media = await data.qr.getQRMedia()
        res.status(200).json(media)
    }

}