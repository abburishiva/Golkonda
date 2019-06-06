var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    log;

function LookupIndustriesModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT led.* ,DATE_FORMAT(led.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime  FROM lookup_industries led WHERE 1=1 ';
    log = new Logger();
    log.info("This is LookupIndutriesModel Constructor...");
}

function trim(data) {
    var keys = Object.keys(data), obj = {};
    if (data.name.trim()) {
        for (var i in keys) {
            typeof (data[keys[i]]) === "string" ? obj[keys[i]] = data[keys[i]].toLowerCase().trim() : obj[keys[i]] = data[keys[i]];
        }
        return obj;
    }
}

LookupIndustriesModel.prototype.find = function (params, callback) {
    log.info("this is LookupIndutriesModel find function");
    var sql = this.tableOnly;
    log.info("this is CommonTypeModel select statement:-" + sql);
    if (params.filters.name) {
        sql += " AND lower(led.name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.flag) {
        sql += " AND lower(led.flag) like '" + params.filters.flag.toLowerCase() + "' ";
    }
    if (params.filters.q) {
        sql += " AND lower(led.name) like '%" + params.filters.q + "%' or description like '%" + params.filters.q + "%'";
    }
    if (params.sorting.sort || (params.sorting.sort && params.filters.order)) {
        sql += " order by " + params.sorting.sort;
    } else if (params.filters.order && !params.sorting.sort) {
        sql += " order by " + params.filters.order + " DESC";
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + (params.paging.limitstart - 1) + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, result) {
        if(err){
            callback(err.sqlMessage,result)
        }else {
            callback(err, result);
        }
    });
};
LookupIndustriesModel.prototype.findOne = function (params, id, callback) {
    log.info("this is LookupIndutriesModel findOne function");
    this.dbMySQL.query(this.tableOnly + ' AND led.id= ' + id, function (err, result) {
        if(err){
            callback(err.sqlMessage,result[0])
        } else{
        callback(err, result[0]);
        }
    });
};
LookupIndustriesModel.prototype.create = function (data, callback) {
    var obj = trim(data);
    log.info("this is LookupIndutriesModel create function");
    this.dbMySQL.query('INSERT INTO lookup_industries SET ?', obj, function (err, result) {
        log.info("LookupIndutriesModel data posting:-" + data);
        if (err) {
            callback(err.sqlMessage, data);
        }
        else {
            log.info("LookupIndutriesModel data posting:-");
            data.id = result.insertId;
            callback(err, data);
        }
    });
};
LookupIndustriesModel.prototype.update = function (id, data, callback) {
    var obj = trim(data);
    log.info("this is LookupIndutriesModel update function");
    this.dbMySQL.query('UPDATE lookup_industries SET ? WHERE id = ' + id, obj, function (err) {
        log.info("this is LookupIndutriesModel update query function:-" + data);
        log.error(err);
        if(err){
            callback(err.sqlMessage,data)
        }else {
            callback(err, data);
        }
    });
};
LookupIndustriesModel.prototype.remove = function (id, callback) {
    log.info("this is LookupIndutriesModel remove function");
    this.dbMySQL.query('DELETE FROM lookup_industries WHERE id = ' + id, callback);
};
LookupIndustriesModel.prototype.search = function (params, callback) {
    log.info("this is LookupIndutriesModel search function");
    this.dbMySQL.query("SELECT * FROM lookup_industries where name like '%" + params.name + "%'", callback);
};
module.exports = LookupIndustriesModel;
