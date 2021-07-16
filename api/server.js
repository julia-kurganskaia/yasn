//@ts-check

const express = require("express");
const server = express();
server.use(express.json());

const tweetsRoutes = require("./tweets");
const usersRoutes = require("./user");
const authRoutes = require("./auth");

server.use("/api/v1/users", usersRoutes);
server.use("/api/v1/me", tweetsRoutes);
server.use("/api/v1", authRoutes);

module.exports = server;
