const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '20040211pjh',    // 如果有密码，填你的
    database: 'million_challenge',
});
module.exports = pool;
