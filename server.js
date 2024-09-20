import express from 'express'
import multer from 'multer'
import fs from 'fs'
import data from './data/index.js'
import services from './services/index.js'
import paths from './paths.js'
import msg from './log.js'

export class Server {

    #express
    #upload
    
    constructor() {
        const storage = multer.diskStorage({

            destination: (req, file, cb) => {
                let uploadDirectory = paths.getTemporaryPath()
                if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory)
                msg.dbg(`Uploading media to temp dir at ${uploadDirectory}`)
                cb(null, uploadDirectory)
            },

            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
        this.#express = express()
        this.#express.use(express.json())

        this.#upload = multer({ 
            storage: storage,
            limits: { fieldSize: 25 * 1024 * 1024 }
        });
        this.#setRoutes()
        this.#setContentTypes()
    }

    start(port) {
        this.#express.listen(port, async () => {
            msg.success(`Server listening on port ${port}`)
        });
    }

    #setRoutes() {

        this.#express.get('/media', services.media.getMedia)
        this.#express.get('/media/:mediaId', services.media.getMediaById)
        this.#express.get('/media/:mediaId/file', services.media.getMediaFile)
        this.#express.get('/media/:mediaId/preview', services.media.getMediaPreview)
        this.#express.get('/tags',services.tags.getTags)
        this.#express.get('/qr/media',services.qr.getMedia)

        this.#express.post('/media', this.#upload.single('media'), services.media.addMedia)
        this.#express.post('/tags', services.tags.addTagToMedia)
        this.#express.post('/user', services.jwt.createUser)
        
        this.#express.delete('/media/:mediaId', services.media.deleteMedia)
        this.#express.delete('/media/:mediaId/tags/:tagName', services.tags.removeTagFromMedia)
        this.#express.delete('/tags/:tagName', services.tags.deleteTag)
    }

    #setContentTypes() {
        express.static.mime.define({'image/heic': ['heic']});
    }

}
