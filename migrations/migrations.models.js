const models_db = [
    {
    source: "bases/users.sqlite",
    create_db: `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            email text UNIQUE,
            password text,
            CONSTRAINT email_unique UNIQUE (email)
            )`
    },
    {
    source: "bases/retros.sqlite",
    create_db: `CREATE TABLE retro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            card text UNIQUE)`
    }
];
module.exports = models_db