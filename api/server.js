//@ts-check

const express = require("express");
const server = express();
server.use(express.json());

const tweetsRoutes = require("./tweets");

server.use("/api/v1/users", tweetsRoutes);

module.exports = server;
