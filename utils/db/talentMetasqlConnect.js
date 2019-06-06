var mysql = require('mysql'),
    config = require('../../config/config.json'),
    async = require('async');

var connection = mysql.createPool({
    host: config.talentMetaSql.host,
    port: config.talentMetaSql.port,
    user: config.talentMetaSql.username,
    password: config.talentMetaSql.password,
    database: config.talentMetaSql.database
});
module.exports = connection;