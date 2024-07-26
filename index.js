const express = require('express');
const { data } = require('./data.js');
const { tasks } = require('./tasks.js');
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 3000; 
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'originals/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

app.use(express.json());

app.get('/items', (req, res) => {
  res.json(data);
});

app.post('/upload', upload.single('photo'), (req, res) => {
    let path = req.file.path
    tasks.addPhoto(req.file.filename).then(photo => {
        tasks.saveExif(photo.photo_id, path)
        tasks.makeThumbnail(photo.photo_id, path)
    })
    res.status(201).json({message: "successfully uploaded"})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});