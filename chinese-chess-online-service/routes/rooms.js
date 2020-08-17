var express = require('express');
var router = express.Router();
var db = require('./../config/db');
var io = require('./../websocket/server');


router.post('/createRoom',(req, res, next) => {
    const userName = req.body.userName;
    const roomName = userName+ (new Date()).getTime();

    db.sql('insert into rooms_tb (room_name,player_first) values (?,?)',[roomName,userName],(result) => {
        if(result.result.affectedRows === 1){
            res.send({code:200,data:{
                roomName:roomName
            }})
            
            io.emit('roomsRefresh',{msg:"rooms更新"})

        }else {
            res.send({code:0,msg:"失败"})
        }
    })
    
})



module.exports = router;

