const { exif } = require('./exif.js');
const { data } = require('./data.js');
const { thumbnails } = require('./thumbnails.js');
const { ocr } = require('./ocr.js');

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
    addMedia: async (path) => {
        console.log(`Adding media at ${path}`)
        return await data.addMedia(path)
    },

    saveExif: exif.saveExif,
    
    makeThumbnail: thumbnails.make,

    runOCR: ocr.run
}