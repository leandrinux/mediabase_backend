const express = require('express')
const multer = require('multer')
const fs = require('fs')
const { services } = require('./services.js')

const C_TEMP_DIRECTORY = 'temp/'

class Server {

    #app
    #upload    
    
    constructor() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                this.#getDestinationDirectory(req, file, cb)
            },
            filename: (req, file, cb) => {
                this.#getFilename(req, file, cb)
            }
        })
        this.#app = express()
        this.#upload = multer({ storage });
        this.#setRoutes()
    }

    start(port) {
        this.#app.listen(port, async () => {
            console.log(`[ ] Server listening on port ${port}`);
            services.initDatabase()
        });
    }

    #getDestinationDirectory(req, file, cb) {
        if (!fs.existsSync(C_TEMP_DIRECTORY)) fs.mkdirSync(C_TEMP_DIRECTORY)
        cb(null, C_TEMP_DIRECTORY);
    }

    #getFilename(req, file, cb) {
        cb(null, file.originalname)
    }

    #setRoutes() {

        this.#app.get('/media', async (req, res) => {
            services.getMedia(req, res)
        })

        this.#app.get('/file', async (req, res) => {
            services.getMediaFile(req, res)
        })

        this.#app.get('/thumb', async (req, res) => {
            services.getMediaThumbnail(req, res)
        })

        this.#app.post('/media', this.#upload.single('media'), async (req, res) => {  
            services.postMedia(req, res)
        })

        this.#app.delete('/media', async (req, res) => {
            services.deleteMedia(req, res)
        })

    }

}

exports.server = new Server()