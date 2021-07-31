//@ts-check

const express = require("express");
const router = express.Router();

const file = __dirname + "/../db/db.sqlite";
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(file);
const jwt = require("express-jwt");
const server = require("./server");
const SECRET_KEY = 'mysecretkey12345';

router.get("/tweets", jwt({secret: SECRET_KEY, algorithms: ['HS256']},), (req, res) => {
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

router.post("/tweets", jwt({secret: SECRET_KEY, algorithms: ['HS256']},), (req, res) => {
  const myTweet = req.body.tweet;
  const userId = req.user.user_id;
  const sql = "INSERT INTO tweets (tweet, date, user_id) VALUES (?, datetime('now') || 'Z', ?)";

  db.run(sql, [myTweet, userId], function(err) {
    if (err) {
      console.log(err);
      res.json("Something went wrong :(");
      return;
    }

    const addedTweet = 'SELECT id, tweet, date, user_id FROM tweets WHERE id = ?';

    db.get(addedTweet, [this.lastID], (err, row) => {
      if (err) {
        console.log(err);
        res.json("Something went wrong :(");
       }

      res.json(row);
    });
  });
});

router.delete("/tweets/:id", jwt({secret: SECRET_KEY, algorithms: ['HS256']},), (req, res) => {
  const tweetId = req.params.id;
  const userId = req.user.user_id;
  const sql = 'SELECT user_id FROM tweets where id = ?';

  db.get(sql, [tweetId], (err, row) => {
    if (err) {
      console.log(err);
      return;
    } else if (row === undefined) {
      res.status(404).send("No tweet. Sorry, can't find that!");
      return;
    }

    if (row.user_id !== userId) {
      res.status(403).end();
      return;
    }

    const tweetToDelete = 'DELETE FROM tweets WHERE id = ?';

    db.run(tweetToDelete, [tweetId], (err) => {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).json("Tweet was deleted.");
    });
  });
});

router.get("/followee", jwt({secret: SECRET_KEY, algorithms: ['HS256']},), (req, res) => {
  const userId = req.user.user_id;
  const sql = `SELECT users.id, users.name
               FROM followers
               JOIN users ON followers.followee = users.id
               WHERE followers.user_id = ?
               ORDER BY name ASC`;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(rows);
  });
});

router.get("/followee/tweets", jwt({secret: SECRET_KEY, algorithms: ['HS256']},), (req, res) => {
  const userId = req.user.user_id;
  const sql = `SELECT tweets.tweet
               FROM followers
               JOIN tweets ON followers.followee = tweets.user_id
               WHERE followers.user_id = ?
               ORDER BY date DESC`;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(rows);
  });
});

router.put("/followee/:id", jwt({secret: SECRET_KEY, algorithms: ['HS256']},), (req, res) => {
  const userId = req.user.user_id;
  const followeeId = req.params.id;
  const sql = `INSERT INTO followers (user_id, followee) VALUES (?, ?)`;

  db.run(sql, [[userId], [followeeId]], (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
