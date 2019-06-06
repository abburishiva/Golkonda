var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    log;

function CommonEntityModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cem.*,DATE_FORMAT(cem.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from common_entity cem where 1=1 ';
    log = new Logger();
    log.info("This is CommonEntityModel Constructor...");
}

CommonEntityModel.prototype.find = function (params, callback) {
    log.info("this is CommonEntityModel find function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    log.info("this is CommonEntityModel select statement:-" + sql);
    if (params && params.filters && params.filters.name) {
        sql += "and  lower(cem.name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params && params.sorting && params.sorting.sort && params && params.filters && !params.filters.order) {
        sql += " order by " + params.sorting.sort;
    }
    else if (params && params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " DESC ";
    } else if (params && params.filters && params.filters.order.toLowerCase() === 'asc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " ASC ";
    }
    if (params && params.paging && params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + (params.paging.limitstart - 1) + "," + params.paging.limitend;
    } else if (params && params.paging && params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, result) {
        if (err) {
            callback(err.sqlMessage, result)
        } else {
            callback(err, result);
        }
    });
};
CommonEntityModel.prototype.findOne = function (params, id, callback) {
    log.info("this is CommonEntityModel findOne function");
    log.info("params");
    log.info(params);
    this.dbMySQL.query(this.tableOnly + 'and cem.id = ' + id, function (err, result) {
        if (err) {
            callback(err.sqlMessage, result)
        } else {
            callback(err, result[0]);
        }
    });
};
CommonEntityModel.prototype.create = function (data, callback) {
    log.info("this is CommonEntityModel create function");
    this.dbMySQL.query('INSERT INTO common_entity SET ?', data, function (err, result) {
        if (result) {
            log.info("inserted results:-" + result);
            data.id = result.insertId;
        }
        log.error(err);
        callback(err, data);
    });
};
CommonEntityModel.prototype.update = function (id, data, callback) {
    log.info("this is CommonEntityModel update function");
    this.dbMySQL.query('UPDATE common_entity SET ? WHERE id = ' + id, data, function (err, result) {
        log.info("updated data:-" + result);
        log.info("updated results:-" + result);
        log.error(err);
        callback(err, data);
    });
};
CommonEntityModel.prototype.remove = function (id, callback) {
    log.info("this is CommonEntityModel remove function");
    this.dbMySQL.query('delete FROM common_entity WHERE id = ' + id, callback);
};
CommonEntityModel.prototype.search = function (params, callback) {
    log.info("this is CommonEntityModel search function");
    this.dbMySQL.query("select * FROM common_entity  where lower(name) like '%" + params.name + "%' or lower(description) like '%" + params.description + "%'", callback);
};
module.exports = CommonEntityModel;
