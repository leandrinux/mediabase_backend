
const sqlite3 = require('sqlite3').verbose()


exports.data = {
    registerNewPhoto: (filename) => {

        let db = new sqlite3.Database('./data.sqlite', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log('Connected to the SQlite database.');
        });
        
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
        
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
        
    }
}