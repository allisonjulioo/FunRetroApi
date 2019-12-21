const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const column = {
  source: 'bases/column.sqlite',
  create_db: `CREATE TABLE column (
            column_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            color text,
            user_id INTEGER,
            board_id INTEGER,
            FOREIGN KEY(board_id) REFERENCES board(board_id));
            )`
}
let db = new sqlite3.Database(column.source, err => {
  if (err) console.error(err.message)
  else
    db.run(column.create_db, err => err)
})
module.exports = db
