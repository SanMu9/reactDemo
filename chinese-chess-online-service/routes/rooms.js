var express = require('express');
var router = express.Router();
var db = require('./../config/db');
var server = require('./../websocket/server');


router.post('/createRoom',(req, res, next) => {
    const userName = req.body.userName;

    
})

module.exports = router;

