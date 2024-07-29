const express = require('express')
const { data } = require('./data.js')
const { tasks } = require('./tasks.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const port = process.env.PORT || 3000; 

const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDirectory = 'temp/'
        if (!fs.existsSync(tempDirectory)) {
            fs.mkdirSync(tempDirectory)
          }         
        cb(null, tempDirectory);
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const upload = multer({ storage });

app.use(express.json());

app.get('/media', async (req, res) => {
    const photos = await data.getAll()
    res.json(photos);
});

app.get('/file', async (req, res) => {
    const fullPath = await data.getFileFullPath(req.query.id)
    if (fullPath)
      res.download(fullPath);
    else
      res.status(404).json({message: "not found"})
});

app.get('/thumb', async (req, res) => {
    const fullPath = await data.getFileFullPath(req.query.id)
    if (fullPath) {
        const file = path.parse(fullPath)
        const thumb = `${file.dir}/thumbs/${file.name}.jpg`
        res.download(thumb);
    } else
        res.status(404).json({message: "not found"})
});

app.post('/media', upload.single('media'), async (req, res) => {  
    const photo = await tasks.addMedia(req.file.filename, req.file.originalname)
    await tasks.saveExif(photo.media_id, req.file.path)
    const filePath = await tasks.relocateMedia(photo.media_id, req.file.path)
    tasks.makeThumbnail(photo.media_id, filePath)
    tasks.runOCR(photo.media_id, filePath)
    res.status(201).json({
        media_id: photo.media_id,
        message: "success"
    })
})

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await tasks.initDatabase()
});