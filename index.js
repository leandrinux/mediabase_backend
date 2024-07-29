const express = require('express')
const { data } = require('./data.js')
const { tasks } = require('./tasks.js')
const multer = require('multer')
const path = require('path')
const port = process.env.PORT || 3000; 
const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'originals/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
})
const upload = multer({ storage });

app.use(express.json());

app.get('/media', async (req, res) => {
    const photos = await data.getAll()
    res.json(photos);
});

app.get('/file', async (req, res) => {
    const file_name = await data.getFileName(req.query.id)
    if (file_name)
      res.download(`originals/${file_name}`);
    else
      res.status(404).json({message: "not found"})
});

app.get('/thumb', async (req, res) => {
    const thumb = await data.getThumb(req.query.id)
    if (thumb)
        res.download(`thumbnails/${thumb}`);
    else
        res.status(404).json({message: "not found"})
});

app.post('/media', upload.single('media'), async (req, res) => {
    let path = req.file.path

    const photo = await tasks.addMedia(req.file.filename)
    tasks.saveExif(photo.media_id, path)
    tasks.makeThumbnail(photo.media_id, path)
    tasks.runOCR(photo.media_id, path)

    res.status(201).json({
        media_id: photo.media_id,
        message: "success"
    })
})

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  await tasks.initDatabase()
});