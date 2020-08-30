const mysql = require('mysql');
const { MYSQL_CONF } = require('./db-config');
const con = mysql.createConnection(MYSQL_CONF);

console.log('==========start============');

// 开始连接
con.connect();
// 统一执行sql的函数
 const exec = (sql) => {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    })
    return promise;
}

module.exports = {
    exec
};
