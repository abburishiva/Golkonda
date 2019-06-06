var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    log;
function LookupEducationModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select lem.*,DATE_FORMAT(lem.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from lookup_education lem WHERE 1=1';
    log = new Logger();
    log.info("This is LookupEducationModel Constructor...");
}
LookupEducationModel.prototype.find = function (params, callback) {
    log.info("this is LookupEducationModel find function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    log.info("sql query:-" + sql);
    if (params.filters.name) {
        sql += " AND lem.name like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params && params.sorting && params.sorting.sort && params.filters && !params.filters.order) {
        sql += " order by " + params.sorting.sort;
    } else if (params && params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " DESC ";
    } else if (params && params.filters && params.filters.order.toLowerCase() === 'asc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " ASC ";
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, callback);
};
LookupEducationModel.prototype.findOne = function (params, id, callback) {
    log.info("this is LookupEducationModel findOne function");
    log.info("params");
    log.info(params);
    this.dbMySQL.query(this.tableOnly + ' AND lem.id = ' + id, function (err, result) {
        log.error(err);
        callback(err, result[0]);
    });
};
LookupEducationModel.prototype.create = function (data, callback) {
    log.info("this is LookupEducationModel create function");
    this.dbMySQL.query('INSERT INTO lookup_education SET ?', data, function (err, result) {
        log.info("results LookupEducationModel create function" + result);
        if (result) {
            data.id = result.insertId;
        }
        log.error(err);
        callback(err, data);
    });
};
LookupEducationModel.prototype.update = function (id, data, callback) {
    log.info("this is LookupEducationModel update function");
    this.dbMySQL.query('UPDATE lookup_education SET ? WHERE id = ' + id, data, function (err, result) {
        log.info("results LookupEducationModel create function:-" + result);
        log.error(err);
        callback(err, data);
    });
};
LookupEducationModel.prototype.remove = function (id, callback) {
    log.info("this is LookupEducationModel remove function");
    this.dbMySQL.query('DELETE FROM lookup_education WHERE id = ' + id, callback);
};
LookupEducationModel.prototype.search = function (params, callback) {
    log.info("this is LookupEducationModel search function");
    log.info("params");
    log.info(params);
    this.dbMySQL.query("SELECT * FROM lookup_education  where name like '%" + params.name + "%' or description like '%" + params.description + "%'", callback);
};
module.exports = LookupEducationModel;
