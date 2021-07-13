//@ts-check

const sqlite3 = require("sqlite3");
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
  {tweet: "Life is good!", date: "2020-05-25T23:59:00+12:00", user_id: 1,},
  {tweet: "I bought a boat!", date: "2021-06-26T14:34:15+12:00", user_id: 3,},
  {tweet: "Hmmm... It's something...", date: "2019-01-02T17:23:34+12:00", user_id: 4,},
  {tweet: "Well, I have a cat <3", date: "2021-11-10T11:34:07+12:00", user_id: 2,},
  {tweet: "No one is born hating another person because of the color of his skin or his background or his religion...", date: "2005-04-17T08:22:55+12:00", user_id: 2,},
  {tweet: "Hey guys, wanna feel old? I'm 40. You're welcome.", date: "1999-12-23T16:40:23+12:00", user_id: 1,},
  {tweet: "Happy Birthday To Me!!!", date: "2011-09-07T20:23:11+12:00", user_id: 4,},
  {tweet: "Very creative!", date: "2001-07-27T01:22:34+12:00", user_id: 3,},
  {tweet: "🙃", date: "2007-12-11T23:03:22+12:00", user_id: 4,},
  {tweet: "Happy Birthday Ada!", date: "2011-05-02T12:15:01+12:00", user_id: 1,},
  {tweet: "Don't drink and Tweet", date: "1995-11-02T12:04:33+12:00", user_id: 3},
  {tweet: "This actually just happened. This is not fake. Click the link to confirm for yourself.", date: "2008-10-27T19:05:03+12:00", user_id: 2,},
  {tweet: "Love you 😘", date: "2021:01:01T01:46:22+12:00", user_id: 3,},
  {tweet: "WHAT’S HAPPENING!?", date: "1999-02-26T18:22:33+12:00", user_id: 2,},
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
