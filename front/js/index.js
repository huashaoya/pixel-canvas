//let serverAddress="106.55.171.221:3008"//线上服务器
let serverAddress="127.0.0.1:3008"//本地服务器
var color = '#6BA25E';
var cellSize = 4;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//连接socket服务器
const socket = io(serverAddress);
socket.on("connect", () => {
    //console.log('连接成功')
    document.getElementById('client-status').innerText='连接服务器成功'
});
 //初始化画布
socket.on("initCanvas", (e) => {
    let pixelArray=e.pixelArray
    let userCount=e.userCount
    //console.log(e)
    for(let i=0;i<pixelArray.length;i++){
        for(let j=0;j<pixelArray[i].length;j++){
            ctx.fillStyle = pixelArray[i][j]
            ctx.fillRect(i*cellSize,j*cellSize,cellSize,cellSize)
        }           
    }
    ctx.font = "bold 50px Arial"
    ctx.fillStyle = "#6BA25E"
    ctx.fillText("芥子世界", 400, 50)
    ctx.font = "bold 15px Arial"
    ctx.fillText("Created by 花哨呀i V2.1.1", 420, 75)
    ctx.fillText(`当前在线人数：${userCount}`, 440, 95)
});
//更新画布
socket.on("update",(e)=>{
        //console.log(e)  
        ctx.fillStyle = e[2];
        ctx.fillRect(e[0]* cellSize,e[1] * cellSize, cellSize, cellSize);
})
//更新在线人数
socket.on("updateUserCount",e=>{
    //console.log(e)
    ctx.fillStyle = "#fff"
    ctx.fillRect(440,80,120,16)
    ctx.fillStyle = "#6BA25E"
    ctx.fillText(`当前在线人数：${e}`, 440, 95)
})
//点击画布
canvas.addEventListener('mousedown', function(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    fillCell(x, y);
});
//画像素点
function fillCell(x, y) {
    //ctx.fillStyle = color;
    //ctx.fillRect(Math.floor(x / cellSize) * cellSize, Math.floor(y / cellSize) * cellSize, cellSize, cellSize);
    socket.emit('draw',[Math.floor(x / cellSize), Math.floor(y / cellSize),color])
}
//选择颜色
document.getElementById('color').addEventListener('change', function(event) {
    color = event.target.value;
});