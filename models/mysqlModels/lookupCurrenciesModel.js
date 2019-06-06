var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    _ = require('lodash'),
    log;

function LookupCurrenciesModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT * FROM lookup_country_currencies WHERE 1=1 ';
    log = new Logger();
    log.info("This is LookupCurrenciesModel Constructor...");
}
LookupCurrenciesModel.prototype.find = function (params, callback) {
    log.info("this is LookupCurrenciesModel find function");
    var sql = this.tableOnly;
    log.info("this is LookupCurrenciesModel select statement:-");
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, result) {
        if(err) {
            log.error(err);
            callback(err.sqlMessage, null);
        }else{
            callback(null, result);
        }
    });
};
LookupCurrenciesModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' AND lookup_country_currencies.id= ' + id, function (err, result) {
        if(err) {
            log.error(err);
            callback(err.sqlMessage, null);
        }else{
            callback(null, result[0]);
        }
    });
};
LookupCurrenciesModel.prototype.create = function (data, callback) {
    var self = this;
    self.dbMySQL.query('select * from lookup_country_currencies where country_id=' + data.country_id + '&& salaryunit_id=' + data.salaryunit_id, function (err, result) {
        if (result && result.length === 0) {
            log.info("this is LookupCurrenciesModel create function");
            self.dbMySQL.query('INSERT INTO lookup_country_currencies SET ?', data, function (err, result) {
                log.info("LookupCurrenciesModel data posting:-");
                if (err) {
                    callback({message: "You have an error in your SQL syntax"},null)
                }
                else{
                    log.info("LookupCurrenciesModel data posting:-");
                    data.id = result.insertId;
                }
                callback(err, data);
            });
        } else {
            callback({message: "Already Exist"}, null)
        }
    });
};
LookupCurrenciesModel.prototype.update = function (id, data, callback) {
    var self = this;
    self.dbMySQL.query('select * from lookup_country_currencies where country_id=' + data.country_id + '&& salaryunit_id=' + data.salaryunit_id, function (err, result) {
        if (result && result.length === 0) {
            log.info("this is LookupCurrenciesModel update function");
            self.dbMySQL.query('UPDATE lookup_country_currencies SET ? WHERE id = ' + id, data, function (err) {
                log.info("this is LookupCurrenciesModel update query function:-");
                log.error(err);
                callback(err, data);
            });
        } else {
            callback({message: "Already Exist"}, null)
        }
    });
};
LookupCurrenciesModel.prototype.remove = function (id, callback) {
    log.info("this is LookupCurrenciesModel remove function");
    this.dbMySQL.query('DELETE FROM lookup_country_currencies WHERE id = ' + id, callback);
};
LookupCurrenciesModel.prototype.search = function (params, callback) {
    log.info("this is LookupCurrenciesModel search function");
    this.dbMySQL.query("SELECT * FROM lookup_country_currencies where name like '%" + params.name + "%' ", callback)
};
module.exports = LookupCurrenciesModel;
