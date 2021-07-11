//@ts-check

const sqlite3 = require("sqlite3").verbose();
const file = __dirname + "/db.sqlite";

const db = new sqlite3.Database(file);

const bcrypt = require("bcrypt");
const saltRounds = 10;

const users = [
  {name: "Adam", email: "adam@gmail.com", status: "Hello World!", password: bcrypt.hashSync("adam", saltRounds),},
  {name: "Eva", email: "eva@gmail.com", status: "I love apples!", password: bcrypt.hashSync("eva", saltRounds),},
  {name: "Dave", email: "dave@gmail.com", status: "Who I am?", password: bcrypt.hashSync("dave", saltRounds),},
  {name: "Margo", email: "margo@gmail.com", status: "Learn JS with me!", password: bcrypt.hashSync("margo", saltRounds),},
];

const tweets = [
  {tweet: "Life is good!", date: "2020-05-25 23:59", user_id: 1,},
  {tweet: "I bought a boat!", date: "2021-06-26 14:34", user_id: 3,},
  {tweet: "Hmmm... It's something...", date: "2019-01-02 17:23", user_id: 4,},
  {tweet: "Well, I have cat <3", date: "2021-11-10 11:34", user_id: 2,},
];

const followers = [
  {user_id: 2, followee: 1,},
  {user_id: 3, followee: 2,},
  {user_id: 1, followee: 4,},
  {user_id: 4, followee: 3,},
  {user_id: 2, followee: 4,},
  {user_id: 1, followee: 2,},
];

db.serialize(function() {
  db.run('DROP TABLE IF EXISTS users');
  db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, status TEXT NOT NULL, password TEXT NOT NULL)');

  let stmt = db.prepare('INSERT INTO users (name, email, status, password) VALUES (?, ?, ?, ?)');
  for (let i = 0; i < users.length; i++) {
    stmt.run(users[i].name, users[i].email, users[i].status, users[i].password);
  }

  stmt.finalize();

  db.run('DROP TABLE IF EXISTS tweets');
  db.run('CREATE TABLE tweets (id INTEGER PRIMARY KEY AUTOINCREMENT, tweet TEXT NOT NULL, date TEXT NOT NULL, user_id INTEGER NOT NULL)');

  stmt = db.prepare('INSERT INTO tweets (tweet, date, user_id) VALUES (?, ?, ?)');
  for (let i = 0; i < tweets.length; i++) {
    stmt.run(tweets[i].tweet, tweets[i].date, tweets[i].user_id);
  }

  stmt.finalize();

  db.run('DROP TABLE IF EXISTS followers')
  db.run('CREATE TABLE followers (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, followee INTEGER NOT NULL)');

  stmt = db.prepare('INSERT INTO followers (user_id, followee) VALUES (?, ?)');
  for (let i = 0; i < followers.length; i++) {
    stmt.run(followers[i].user_id, followers[i].followee);
  }

  stmt.finalize();
});

db.close();
