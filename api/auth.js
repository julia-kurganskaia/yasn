//@ts-check

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey12345";
const bcrypt = require("bcrypt");

const file = __dirname + "/../db/db.sqlite";
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database(file);

function findUserByEmail(email) {
  const sql = 'SELECT id, password FROM users WHERE email = ?';

  return new Promise((resolve, reject) => {
    db.get(sql, [email], (err, row) => {
      if (err || row === undefined) {
        reject(err);
        return;
      }

      resolve(row);
    });
  });
};

router.post("/auth", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  findUserByEmail(email)
    .then(user => {
      bcrypt.compare(password, user.password)
        .then(result => {
          if (result) {
            res.json({
              success: true,
              token: jwt.sign({user_id: user.id}, SECRET_KEY, { algorithm: 'HS256'}),
            });
          } else {
            res.json({success: false,});
          }
        })
    })
    .catch(() => {
      res.json({success: false,});
    })
})

module.exports = router;
