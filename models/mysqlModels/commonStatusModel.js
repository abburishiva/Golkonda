var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    log;
function CommonStatusModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cs.*,DATE_FORMAT(cs.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_status cs,common_entity ce where  cs.entityid= ce.id';
    this.deatailTableSQL = 'cs.id,ce.id as common_entity__id,ce.name as common_entity__name,ce.display_name as common_entity__displayname,ce.description as common_entity__description,cs.name,cs.display_name,cs.description';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cs.*', this.deatailTableSQL);
    log = new Logger();
    log.info("This is CommonStatusModel Constructor...");
}
CommonStatusModel.prototype.find = function (params, callback) {
    log.info("this is CommonStatusModel find function:" + params);
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
        log.info("params.type:-" + sql);
    }
    if (params.filters.name) {
        sql += " and lower(cs.name) like '" + params.filters.name.toLowerCase() + "' ";
        log.info("params.filters.name:-" + sql);
    }
    if (params.filters.entityid) {
        sql += " and cs.entityid = " + params.filters.entityid;
        log.info("params.filters.entityid:-" + sql);
    }
    if (params && params.sorting && params.sorting.sort && params.filters && !params.filters.order) {
        sql += " order by " + params.sorting.sort;
    }
    else if (params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " DESC ";
    }else if (params && params.filters && params.filters.order.toLowerCase() === 'asc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " ASC ";
    }
    if (params && params.paging && params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + (params.paging.limitstart - 1) + "," + params.paging.limitend;
    } else if (params && params.paging && params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info("this.dbMySQL.query:-" + sql);
        if (err) {
            log.error(err);
            return callback(err.sqlMessage);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            log.info("params.type && params.type.toLowerCase() === 'all':-" + sql);
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            log.error(err);
            callback(err, results);
        }
    });
};
CommonStatusModel.prototype.findOne = function (params, id, callback) {
    log.info("this is CommonStatusModel findOne function:-" + params);
    var sql = this.tableOnly;
    log.info("sql query:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    log.info("sql query typeall:-" + sql);
    sql += ' and cs.id = ' + id;
    log.info("sql query by id typeall:-" + sql);
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            return callback(err.sqlMessage);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            log.info("finalResult:-" + finalResult);
            callback(err, finalResult);
        } else {
            log.error(err);
            callback(err, results[0]);
        }
    });
};
CommonStatusModel.prototype.create = function (data, callback) {
    log.info("this is CommonStatusModel findOne function:-" + data);
    this.dbMySQL.query('INSERT INTO common_status SET ?', data, function (err, result) {
        log.info("this is CommonStatusModel create results" + result);
        if (result) {
            data.id = result.insertId;
        }
        log.error(err);
        callback(err, data);
    });
};
CommonStatusModel.prototype.update = function (id, data, callback) {
    log.info("this is CommonStatusModel remove function");
    this.dbMySQL.query('UPDATE common_status SET ? WHERE id = ' + id, data, function (err, result) {
        log.info("this is CommonStatusModel update results:-" + result);
        log.error(err);
        callback(err, data);
    });
};
CommonStatusModel.prototype.remove = function (id, callback) {
    log.info("this is CommonStatusModel remove function");
    this.dbMySQL.query('delete FROM common_status WHERE id = ' + id, callback);
};
CommonStatusModel.prototype.search = function (params, callback) {
    log.info("this is CommonStatusModel search function" + params);
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(cs.name) like '%" + params.name + "%'";
    }
    if (params.description) {
        sql += " and  lower(cs.description)  like '%" + params.description + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info("this is CommonStatusModel search results" + results);
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
            log.error(err);
        }
    });
};
module.exports = CommonStatusModel;