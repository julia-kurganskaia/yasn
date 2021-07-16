//@ts-check

const express = require("express");
const router = express.Router();

const file = __dirname + "/../db/db.sqlite";
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(file);
const jwt = require("express-jwt");
const SECRET_KEY = 'mysecretkey12345';

router.get("/tweets", jwt({secret: SECRET_KEY, algorithms: ['HS256'], credentialsRequired: false,},), (req, res) => {
  const userId = req.user.user_id;
  const sql = 'SELECT tweet, date FROM tweets WHERE user_id = ? ORDER BY date DESC';

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }

    res.json(rows);
  });
});

module.exports = router;
