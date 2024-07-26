const util = require("util");
const sqlite3 = require('sqlite3').verbose()

function connect() {
    return new sqlite3.Database('./data.sqlite', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
    });
}

function disconnect(db) {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
}

function registerNewPhoto(filename) {
    let db = connect()
    db.serialize(() => {
        db.run(
            `INSERT INTO photos(filename) VALUES(?)`,
            [ filename ]
        ), (err, row) => {
            if (err){
              throw err;
            }
            console.log(row.message)
        }
    })
    disconnect(db)
}

function saveExifData(photoid, data) {
    let db = connect()
    db.serialize(() => {
        db.run(
            `INSERT INTO exif(photoid, latitude, longitude) VALUES(?)`,
            [ photoid, latitude, longitude ]
        ), (err, row) => {
            if (err){
              throw err;
            }
            console.log(row.message)
        }
    })
    disconnect(db)
}

exports.data = {
    registerNewPhoto: registerNewPhoto,
    saveExifData: saveExifData
}