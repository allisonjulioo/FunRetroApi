const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const retro = {
  source: 'bases/retro.sqlite',
  create_db: `CREATE TABLE retro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            created_date date,
            user_id INTEGER UNIQUE
            )`
}
let db = new sqlite3.Database(retro.source, err => {
  if (err) console.error(err.message)
  else
    db.run(retro.create_db, err => {
      err
    })
})
module.exports = db
