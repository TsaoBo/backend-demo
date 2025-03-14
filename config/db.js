const mysql = require('mysql2')
const config = require('./dev_config')
const db = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  waitForConnections: true, 
  connectionLimit: 10, //連線限制 最多10個 mysql 連線
  queueLimit: 0 // 不限制排隊請求的數量
})

module.exports = db.promise()
