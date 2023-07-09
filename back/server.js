//后端入口文件
const express = require("express");
const http = require("http");
const mysql=require('mysql');
const socketIo = require("socket.io");

//全局参数设置
const port=3008


const app = express(); 
const server = http.createServer(app);
const io = socketIo(server,{//设置cors
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }});


let pixelArray= new Array(250); 
// for(let i = 0;i < pixelArray.length; i++){
//     pixelArray[i] = new Array(250).fill('#fff'); //每行有10列
// }
const connection = mysql.createConnection({
    host: '106.55.171.221',
    user: 'pixel-canvas',
    password: 'pixel-canvas',
    database: 'pixel-canvas'
    });

connection.query('SELECT data FROM canvas WHERE id=1', (error, results) => {
    if (error) 
    {
        console.error('Error querying database: ', error);
    }else{
       // console.log(JSON.parse(results[0].data))
       pixelArray=JSON.parse(results[0].data)
    //    let e=JSON.parse(results[0].data)
       
    //    for(let i=0;i<e.length;i++){
    //     for(let j=0;j<e[i].length;j++){
    //         pixelArray[i][j]=e[i][j]
    //     }           
    // }
    }
})

//每1000秒定时将画布持久化到数据库
var timer = setInterval(function(){
    connection.query('update canvas set data=? where id=1',[JSON.stringify(pixelArray)], (error, results) => {
        if (error) 
        {
            console.error('Error querying database: ', error);
        }else{
            console.log('画布持久化完成')
          
        }
    })
    },1000*1000);




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
        //console.log(data)
        pixelArray[data[0]][data[1]]=data[2]
        io.emit('update',data)
    })
});

server.listen(port, () => {
  console.log("Socket io Server Listening on"+port);
});