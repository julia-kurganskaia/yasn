//@ts-check

const express = require("express");
const router = express.Router();

const file = __dirname + "/../db/db.sqlite";
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(file);

router.get("/:userName/tweets", (req, res) => {
  const name = req.params.userName;
  const sql = 'SELECT tweet FROM tweets WHERE user_id = (SELECT id FROM users WHERE lower(name) = ?)';

  db.all(sql, [name], (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }

    res.json(rows);
  });
});

module.exports = router;
