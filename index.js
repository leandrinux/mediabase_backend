const express = require('express');
const { data } = require('./data.js');
const { tasks } = require('./tasks.js');
const multer = require('multer');
const path = require('path');
const port = process.env.PORT || 3000; // Use the port provided by the host or default to 3000
const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'incoming/');
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
    tasks.addPhoto(req.file.filename).then(photo => {
        tasks.saveExif(photo.photo_id, req.file.path)
    })
    res.status(201).json({message: "successfully uploaded"})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});