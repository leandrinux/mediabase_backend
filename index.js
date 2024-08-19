import express from 'express'
import multer from 'multer'
import fs from 'fs'
import data from './data/index.js'
import services from './services/index.js'
import paths from './paths.js'

class Server {

    #app
    #upload
    
    constructor() {
        const storage = multer.diskStorage({

            destination: (req, file, cb) => {
                let uploadDirectory = paths.getTemporaryPath()
                if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory)
                console.log(`[ ] Uploading media to temp dir at ${uploadDirectory}`)
                cb(null, uploadDirectory)
            },

            filename: (req, file, cb) => {
                cb(null, file.originalname)
            }
        })
        this.#app = express()
        this.#upload = multer({ 
            storage: storage,
            limits: { fieldSize: 25 * 1024 * 1024 }
        });
        this.#setRoutes()
    }

    start(port) {
        this.#app.listen(port, async () => {
            console.log(`[ ] Server listening on port ${port}`)
            await data.models.init()
        });
    }

    #setRoutes() {

        this.#app.get('/media', services.media.getMedia)
        this.#app.get('/media/:mediaId', services.media.getMediaById)
        this.#app.get('/media/:mediaId/file', services.media.getMediaFile)
        this.#app.get('/media/:mediaId/preview', services.media.getMediaPreview)
        this.#app.get('/tags',services.tags.getTags)

        this.#app.post('/media', this.#upload.single('media'), services.media.addMedia)
        this.#app.post('/tags', services.tags.addTagToMedia)
        
        this.#app.delete('/media/:mediaId', services.media.deleteMedia)
        this.#app.delete('/media/:mediaId/tags/:tagName', services.tags.removeTagFromMedia)
    }

}

new Server().start(3000)