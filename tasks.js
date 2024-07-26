const { exif } = require('./exif.js');
const { data } = require('./data.js');
const { thumbnails } = require('./thumbnails.js');

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
    addPhoto: async (path) => {
        console.log(`Adding photo at ${path}`)
        return await data.addPhoto(path)
    },

    saveExif: exif.saveExif,
    
    makeThumbnail: thumbnails.make
}