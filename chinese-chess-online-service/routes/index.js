var express = require('express');
var router = express.Router();
var db = require('./../config/db');

const {userStatus} = require('./../public/javascripts/userIOMap');

// var app = express();

// app.get('/',)
router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
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

router.post('/registerName', function (req, res, next) {
    const userName = req.body.userName;
    db.sql('select name from users_tb where name = ?', [userName], function (result) {
        if (result.code) {
            //用户名不存在
            if (result.result.length == 0) {
                db.sql('insert into users_tb (name) values (?)', [userName], result => {

                    if (result.result.affectedRows === 1) {
                        res.send({ code: 200 });
                    } else {
                        res.send({ code: 0, msg: "插入失败" });
                    }

                })
            } else {
                res.send({ code: 201, msg: "用户名已存在" })
            }
        } else {
            res.send({ code: 0, msg: "发生错误" })
        }

    })
})

router.get('/getRoomsInfo', function (req, res, next) {
    const userName = req.body.userName;
    db.sql('select * from rooms_tb', [], function (result) {
        res.send(result.result);
    })
});

router.post('/createRoom', function (req, res, next) {
    const userName = req.body.userName;
    // db.sql('insert into rooms_tb ()')
})

router.post('/getOtherUserList',function(req,res,next){
    const userName = req.body.userName;
    console.log('getOtherUserList')
    console.log(userStatus)
    db.sql('select * from users_tb where name != ?',[userName],function(result){
        const data = result.result.map(item=>{
            return {
                ...item,
                status:userStatus[item.name]?userStatus[item.name]:0
            }
        })
        res.send(data)
    })
})

module.exports = router;
