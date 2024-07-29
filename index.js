const express = require('express')
const { data } = require('./data.js')
const { tasks } = require('./tasks.js')
const multer = require('multer')
const path = require('path')
const port = process.env.PORT || 3000; 
const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
/*
    ,
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
*/
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