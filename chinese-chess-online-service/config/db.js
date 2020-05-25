const mysql = require('mysql');
const dbConfig = require('./db.config');

module.exports = {
    sql: function (sql, params, callback) {
        var connection = mysql.createConnection(dbConfig);
        connection.connect(function (err) {
            if (err) {
                console.log("数据库连接失败")
                throw err
            }

            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log(err.message)
                    throw err;
                }

                callback&&callback(results);

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