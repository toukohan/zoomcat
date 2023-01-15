const sqlite3 = require("sqlite3");
const bcrypt = require("bcryptjs");
const { mkdirSync, existsSync } = require("fs");

// create folder for database if it doesn't exist
if (!existsSync("./db")) mkdirSync("./db");

const db = new sqlite3.Database("./db/zoomcat.db");

// create db tables and a default user if they don't exist
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users ( \
        id INTEGER PRIMARY KEY, \
        username TEXT UNIQUE, \
        email TEXT UNIQUE, \
        password BLOB \
        )"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS messages ( \
        id INTEGER PRIMARY KEY, \
        user_id INTEGER, \
        sender TEXT, \
        content TEXT \
        )"
  );

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync("zoom", salt);
  db.run(
    "INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)",
    ["zoom", "zoom@cat", hash]
  );
});

module.exports = db;
