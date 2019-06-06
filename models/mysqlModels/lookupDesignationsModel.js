var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    _ = require('lodash'),
    log;

function LookupDesignationsModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT led.* ,DATE_FORMAT(led.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime  FROM lookup_emp_designation led WHERE 1=1 ';
    log = new Logger();
    log.info("This is LookupDesignationsModel Constructor...");
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


LookupDesignationsModel.prototype.find = function (params, callback) {
    log.info("this is LookupDesignationsModel find function");
    var sql = this.tableOnly;
    log.info("this is CommonTypeModel select statement:-");
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
LookupDesignationsModel.prototype.findOne = function (params, id, callback) {
    log.info("this is LookupDesignationsModel findOne function");
    this.dbMySQL.query(this.tableOnly + ' AND led.id= ' + id, function (err, result) {
        log.error(err);
        if(err){
            callback(err.sqlMessage,result[0])
        }else {
            callback(err, result[0]);
        }
    });
};
LookupDesignationsModel.prototype.create = function (data, callback) {
    if (data.name === '') {
        callback({message: "Name is Mandatory"})
    }
    var obj = trim(data);
    log.info("this is LookupDesignationsModel create function");
    this.dbMySQL.query('INSERT INTO lookup_emp_designation SET ?', obj, function (err, result) {
        log.info("LookupDesignationsModel data posting:-");
        if (err) {
            callback(err.sqlMessage, data);
        }
        else {
            log.info("LookupDesignationsModel data posting:-");
            data.id = result.insertId;
            callback(err, data);
        }
    });
};
LookupDesignationsModel.prototype.update = function (id, data, callback) {
    if (data.name === '') {
        callback({message: "Name is Mandatory"})
    }
    var obj = trim(data);
    log.info("this is LookupDesignationsModel update function");
    this.dbMySQL.query('UPDATE lookup_emp_designation SET ? WHERE id = ' + id, obj, function (err) {
        log.info("this is LookupDesignationsModel update query function:-");
        data.id = id;
        log.error(err);
        if(err){
            callback(err.sqlMessage,data)
        }else {
            callback(err, data);
        }
    });
};
LookupDesignationsModel.prototype.remove = function (id, callback) {
    log.info("this is LookupDesignationsModel remove function");
    this.dbMySQL.query('DELETE FROM lookup_emp_designation WHERE id = ' + id, callback);
};
LookupDesignationsModel.prototype.search = function (params, callback) {
    log.info("this is LookupDesignationsModel search function");
    this.dbMySQL.query("SELECT * FROM lookup_emp_designation where name like '%" + params.name + "%' ", callback)
};
module.exports = LookupDesignationsModel;
