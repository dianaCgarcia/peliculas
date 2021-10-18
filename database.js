//Loading SQLite
var sqlite3 = require('sqlite3')

//Definition of SQLite database file
const DBSOURCE = "db.sqlite"

//Initialization of the SQLite database as db
let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      //Error opening the database
        console.error(err.message)
        throw err
    }else{
        console.log('Connected to the SQLite database.')
        //Create table user
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE, 
            firstName TEXT, 
            lastName TEXT, 
            password TEXT, 
            CONSTRAINT email_unique UNIQUE (email)
            );`,
        (err) => {
            if (err) {
                //Table already exist
            }
        });
        //Create table favoritos
        db.run(`CREATE TABLE favoritos (
            user_id INTEGER, 
            movie_id INTEGER,
            addedAt TEXT,
            FOREIGN KEY(user_id) REFERENCES user(id)
            )`,
        (err) => {
            if (err) {
                //Table already exist
            }
        });
    }
});

//Make public the database connection object
module.exports = db