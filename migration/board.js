const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const board = {
  source: 'bases/board.sqlite',
  create_db: `CREATE TABLE board (
            board_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            created_date date,
            user_votes INTEGER,
            limit_votes INTEGER,
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES user(id_user));
            )`
}
let db = new sqlite3.Database(board.source, err => {
  if (err) console.error(err.message)
  else
    db.run(board.create_db, err => err)
})
module.exports = db
