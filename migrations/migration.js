const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')
const migration = require('./migrations.models');

migration.forEach( base => {
    let db = new sqlite3.Database(base.source, (err) => {
        if (err) console.error(err.message);
        else
        db.run(base.create_db, err => err);
    });
    module.exports = db
});