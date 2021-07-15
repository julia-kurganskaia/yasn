//@ts-check

const express = require("express");
const server = express();
server.use(express.json());

const tweetsRoutes = require("./tweets");
const authRoutes = require("./auth");

server.use("/api/v1/users", tweetsRoutes);
server.use("/api/v1/me", tweetsRoutes);
server.use("/api/v1", authRoutes);

module.exports = server;
