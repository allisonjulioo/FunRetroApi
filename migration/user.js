const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const user = {
  source: 'bases/user.sqlite',
  create_db: `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            )`
}

let db = new sqlite3.Database(user.source, err => {
  if (err) console.error(err.message)
  else
    db.run(user.create_db, err => {
      err
    })
})
module.exports = db
