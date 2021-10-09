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
        //Creation of table user
        db.run(`CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE, 
            firstName TEXT, 
            lastName TEXT, 
            password TEXT, 
            CONSTRAINT email_unique UNIQUE (email)
            );
            CREATE TABLE favoriteMovie (
                user_id INTEGER, 
                movie_id INTEGER,
                FOREIGN KEY(user_id) REFERENCES user(id)
                )`,
        (err) => {
            if (err) {
                //Table already exist
            }else{
                //Table created and now some rows are created
                var insert = 'INSERT INTO user (email, firstName, lastName, password) VALUES (?,?,?,?)'
                db.run(insert, ["admin@example.com","admin","admin","admin123456"])
                db.run(insert, ["admin1@example.com","admin1","admin","admin123456"])
                db.run(insert, ["admin2@example.com","admin2","admin","admin123456"])
                db.run(insert, ["admin3@example.com","admin3","admin","admin123456"])
                db.run(insert, ["admin4@example.com","admin4","admin","admin123456"])
            }
        });
        //Creation of table favoriteMovie
        db.run(`CREATE TABLE favoriteMovie (
                user_id INTEGER, 
                movie_id INTEGER,
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