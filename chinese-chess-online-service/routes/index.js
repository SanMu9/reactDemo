var express = require('express');
var router = express.Router();
var db = require('./../config/db');

var app = express();

// app.get('/',)
router.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

router.get('/', function (req, res, next) {
  var data = { data: "sss" };

  let params = req.params
  let dataset = [];
  let hostname = req.hostname,
    path = req.path,
    route = req.route,
    baseUrl = req.baseUrl,
    ip = req.ip,
    ips = req.ips,
    originUrl = req.originalUrl;
  // for(key in req){
  //   dataset.push(key)
  // }
  res.send(path);

  // res.render('index', { title: 'Express' });
});

router.get('/getRoomsInfo', function (req, res, next) {
  db.sql('select * from rooms_tb',[],function(result){
    console.log(result)
    res.send(result);
  })
});

router.post('/createRoom',function(req, res, next){

  // db.sql('insert into rooms_tb ()')
})

module.exports = router;
