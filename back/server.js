const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express(); 
const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }});

const port=3001


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
let users = {};

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("drawCanvas", users);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete users[socket.id];
    io.emit("drawCanvas", users);
  });

  socket.on("sendDrawing", (data) => {
    console.log("Client sent drawing: ", data);
    users[socket.id] = data;
    io.emit("drawCanvas", users);
  });
});

server.listen(port, () => {
  console.log("Socket io Server Listening on *:"+port);
});