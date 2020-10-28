var express = require('express');
var router = express.Router();
const {userIOMap,GameMap,userStatus} = require('./../public/javascripts/userIOMap');
var io = require('./../websocket/server');
var db = require('./../config/db');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/invite',function(req,res,next){
  const userName = req.body.userName;
  const invitor = req.body.invitor;
  console.log(userName,invitor)
  if(userIOMap[userName]){
    console.log(userIOMap[userName])
    res.send({code:200})
    io.to(userIOMap[userName]).emit("invite",invitor);
  }
})

router.post('/createGame',function(req,res,next){
  const player1 = req.body.invitor;
  const player2 = req.body.userName;
  const game_id = player1+"-"+player2+"-"+(new Date()).getTime();

  db.sql('insert into games_tb (game_id,player1,player2,player_next) values (?,?,?,?)',[game_id,player1,player2,player1],(result) => {
    console.log(result)
    if(result.result.affectedRows === 1){
      res.send({code:200,data:game_id})
      GameMap[player2] = player1;
      GameMap[player1] = player2;

      userStatus[player1] = 2;
      userStatus[player2] = 2;
      io.emit('usersUpdate');

      io.to(userIOMap[player1]).emit("beginGame",{gameId:game_id,player1:player1,player2:player2});
      
    }
    
  })

})

router.post('/getGameDetail',function(req,res,next){
  const gameId = req.body.gameId;
  db.sql('select * from games_tb where id = (select max(id) from games_tb where game_id = ?)',[gameId],(result) => {
    console.log(result)
    if(result.code === 1){
      res.send({code:200,data:result.result})
    }
  })
});

router.post('/chessMove',function(req,res,next){
  const {chessInitPos,pos,id,squares,gameId,player1,player2,winner,userName} = req.body;
  db.sql('insert into games_tb (game_id,player1,player2,step,winner,player_next) value(?,?,?,?,?,?)',[gameId,player1,player2,squares,winner,GameMap[userName]],(result)=> {
    // console.log(result)
    console.log(chessInitPos)
    console.log(pos)

    if(result.code ===1){
      io.to(userIOMap[GameMap[userName]]).emit('rivalMove',{chessInitPos,pos,id});
      res.send({code:200,data:"请求成功"})
    }
  })
  
})

router.post('/gameover',function(req,res,next){
  const {player1,player2} = req.body;

  userStatus[player1] = 1;
  userStatus[player2] = 1;
  delete  GameMap[player2];
  delete  GameMap[player1];
  res.send({code:200,data:'游戏结束'})

})

module.exports = router;
