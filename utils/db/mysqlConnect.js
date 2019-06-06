var mysql = require('mysql'),
    config = require('../../config/config.json'),
    async = require('async');

var connection = mysql.createPool({
    host: config.dev.mysql.host,
    port: config.dev.mysql.port,
    user: config.dev.mysql.username,
    password: config.dev.mysql.password,
    database: config.dev.mysql.database
});
module.exports = connection;
