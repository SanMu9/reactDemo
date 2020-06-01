const mysql = require('mysql');
const dbConfig = require('./db.config');

module.exports = {
    sql: function (sql, params, callback) {
        var connection = mysql.createConnection(dbConfig);
        connection.connect(function (err) {
            let res = {};
            if (err) {
                console.log(err)
                console.log("数据库连接失败")
                res = {
                    code:0,
                    msg:"数据库连接失败",
                };
                callback||callback(res)
                throw err
            }

            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log(err.message)
                    res = {
                        code:0,
                        msg:err.message,
                    };
                    throw err;
                }
                res = {
                    code:1,
                    result:results
                };

                callback&&callback(res);

                connection.end(function(err){
                    if(err){
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                })
            })

        })
    },
}