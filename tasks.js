const { exif } = require('./exif.js');
const { data } = require('./data.js');

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
    addPhoto: (filename) => {
        return data.registerNewPhoto(filename)
    },

    saveExif: exif.saveExif
    
}