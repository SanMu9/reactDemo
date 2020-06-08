var express = require('express');
var router = express.Router();
const db = require('./../config/db');

const Jwt  = require('./../public/javascripts/jwt')

// const app = express();

router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

router.post('/', function(req, res, next) {
    const userName = req.body.userName;
    const pw = req.body.pw;
    const data  = {
        userName:userName,
        pw:pw
    };
    console.log(data)
    const token = Jwt.generateToken(data);
    
    db.sql('UPDATE users_tb SET token = ? WHERE name = ?',[token,userName],(result)=>{
        console.log(result)
        if (result.result.affectedRows === 1) {
            res.send({ code: 200,token:token });
        } else {
            res.send({ code: 0, msg: "失败" });
        }
    })
});

router.post('/register',(req, res, next) => {
    const userName = req.body.userName;
    const pw = req.body.pw;
    const data  = {
        userName:userName,
        pw:pw
    };
    const token = Jwt.generateToken(data);

    db.sql('select name from users_tb where name = ?',[userName],(result) => {
        if(result.code) {
            // 用户名不存在
            if(result.result.length === 0){
                db.sql('insert into users_tb (name,pw,token) values (?,?,?)',[userName,pw,token],(result)=>{
                    if (result.result.affectedRows === 1) {
                        res.send({ code: 200,token:token });
                    } else {
                        res.send({ code: 0, msg: "插入失败" });
                    }
                })
            }else{
                res.send({
                    code:201,
                    msg:"用户名已存在"
                })
            }
        }else{
        }
    })

})

module.exports = router;


