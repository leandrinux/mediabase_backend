const util = require("util");
const { Photo } = require("./models.js");

async function addPhoto(filename) {
    return await Photo.create({
        file_name: filename
    })
}

async function addExifData(photo_id, data) {
    Photo.update({ 
        latitude: data.latitude,
        longitude: data.latitude
    },{ 
        where: { photo_id: photo_id }
    })
}

async function addThumbnail(photo_id, thumb_name) {
    Photo.update(
        { thumb: thumb_name },
        { where: { photo_id: photo_id }}
    )
}

async function getAll() {
    return await Photo.findAll({
        attributes: [
            'photo_id', 
            'latitude', 
            'longitude'
        ],
    })
}

async function getFileName(photo_id) {
    const photo = await Photo.findByPk(photo_id)
    return photo?.file_name
}

async function getThumb(photo_id) {
    const photo = await Photo.findByPk(photo_id)
    return photo?.thumb
}

exports.data = {
    addPhoto: addPhoto,
    addExifData: addExifData,
    addThumbnail: addThumbnail,
    getAll: getAll,
    getFileName: getFileName,
    getThumb: getThumb
}