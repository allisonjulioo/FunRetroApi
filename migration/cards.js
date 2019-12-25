const sqlite3 = require('sqlite3').verbose()

const card = {
  source: 'bases/card.sqlite',
  create_db: `CREATE TABLE card (
            card_id INTEGER PRIMARY KEY AUTOINCREMENT,
            content VARCHAR(25),
            created_date DATETIME,
            board_id INTEGER,
            column_id INTEGER,
            user_id INTEGER,
            FOREIGN KEY(column_id) REFERENCES column(id_column));
            )`
}
let db = new sqlite3.Database(card.source, err => {
  if (err) console.error(err.message)
  else
    db.run(card.create_db, err => err)
})
module.exports = db
