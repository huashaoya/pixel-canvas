//后端入口文件
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express(); 
const server = http.createServer(app);
const io = socketIo(server,{//设置cors
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }});

//全局参数设置
const port=3001

let pixelArray= new Array(50); 
for(var i = 0;i < pixelArray.length; i++){
    pixelArray[i] = new Array(50).fill('#fff'); //每行有10列
}

let userCount=0;
io.on("connection", (socket) => {
    userCount++
    console.log("新连接,连接数："+userCount);

    socket.emit("initCanvas", pixelArray);

    socket.on("disconnect", () => {
        userCount--
        console.log("连接断开,连接数："+userCount);
        //delete users[socket.id];
        //io.emit("drawCanvas", users);
    });

    socket.on("sendDrawing", (data) => {
        console.log("Client sent drawing: ", data);
       // users[socket.id] = data;
        //io.emit("drawCanvas", users);
    });
    socket.on('draw',(data)=>{
        console.log(data)
        pixelArray[data[0]][data[1]]=data[2]
        io.emit('update',data)
    })
});

server.listen(port, () => {
  console.log("Socket io Server Listening on"+port);
});