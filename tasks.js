const { exif } = require('./exif.js');
const { data } = require('./data.js');
const { thumbnails } = require('./thumbnails.js');
const { ocr } = require('./ocr.js');
const { fileops } = require('./fileops.js')

/*
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();

orchestrator.add('save_to_database', function(){
    console.log(`Saving to database`);
    data.push()
});

orchestrator.start('save_to_database', function (err) {
    // all done
});
*/

exports.tasks = {

    // creates the database if it doesn't exist
    initDatabase: data.initDatabase,

    // adds new media to the database by copying it to the temp
    // directory and creating the initial record in the media table
    addMedia: async (path) => {
        console.log(`[ ] Adding media ${path}`)
        return await data.addMedia(path)
    },

    // extracts and saves exif data for the specified media
    saveMetadata: exif.saveMetadata,

    // relocates media from the temp folder to its final place
    relocateMedia: fileops.relocateMedia,
    
    // creates a thumbnail for the specified media
    makeThumbnail: thumbnails.makePhotoThumbnail,

    runOCR: ocr.run
}