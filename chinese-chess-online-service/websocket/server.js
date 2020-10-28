const express = require("express");
const ws = require('nodejs-websocket');
const app = require('../app');
const server = require('http').createServer().listen(8088);

const {userIOMap,userStatus} = require('./../public/javascripts/userIOMap');
const io = require('socket.io')(server);


// const userIOMap = {

// }
// console.log(app)
// console.log(express())


io.on('connection',(socket) => {
    console.log("connect:"+socket.id)

    console.log(userIOMap);

    socket.on('userAdd',(data) => {
        const {userName,token} = data;
        userIOMap[userName]=socket.id;
        userIOMap[socket.id]=userName;
        userStatus[userName] = 1;
        socket.broadcast.emit('usersUpdate')
        console.log(userIOMap);
        // io.to(socket.id).emit('message','surprise');//给指定客户端发送
    })

    socket.on('disconnect',(reason)=>{

        io.emit('usersUpdate')
        const userName = userIOMap[socket.id];
        console.log('disconnect:'+socket.id);
        userStatus[userName] = 0;
        delete userIOMap[socket.id];
        delete userIOMap[userName];
    })
    // socket.on('sendmsg', (data)=>{
    //     console.log(data)
    //     io.emit('recvmsg',data)
    // })
})
// const host = 8088;

// const createServer = () => {
//     let server = ws.createServer(connection => {

//         connection.on('text', function (result) {
//             console.log('发送消息', result)
//         })
//         connection.on('connect', function (code) {
//             console.log('开启连接', code)
//         })
//         connection.on('close', function (code) {
//             console.log('关闭连接', code)
//         })
//         connection.on('error', function (code) {
//             console.log('异常关闭', code)

//             // 某些情况如果客户端多次触发连接关闭，会导致connection.close()出现异常，这里try/catch一下
//             try {
//                 connection.close()
//             } catch (error) {
//                 console.log('close异常', error)
//             }
//             console.log('异常关闭', code)
//         })
//     }).listen(host)

//     // 所有连接释放时，
//     server.on('close', () => {

//     })

//     server.on('connection',(conn) => {
//         console.log(server.connections.length)
//     })
//     return server;
// }
// console.log("Server")
// coniost server = createServer()

module.exports = io;