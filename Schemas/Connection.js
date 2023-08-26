const mysql = require('mysql2')
const process = require('dotenv').config()

const connection = mysql.createConnection({
    host: process.parsed.HOST,
    user: process.parsed.USER,
    password: process.parsed.PASSWORD,
    database: process.parsed.DATABASE,
    port: process.parsed.PORT,
})

module.exports = connection;