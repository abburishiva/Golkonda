var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    log;
function CommonTypeModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ct.*,DATE_FORMAT(ct.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_types ct,common_entity ce where ct.entityid= ce.id';
    this.deatailTableSQL = 'ct.id,ce.id as common_entity__id,ce.name as common_entity__name,ce.display_name as common_entity__displayname,ce.description as common_entity__description,ct.name,ct.display_name,ct.description';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ct.*', this.deatailTableSQL);
    log = new Logger();
    log.info("This is CommonLevelModel Constructor...");
}
CommonTypeModel.prototype.find = function (params, callback) {
    log.info("this is CommonLevelModel find function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    log.info("this is CommonTypeModel select statement:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(ct.name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.entityid) {
        sql += " and ce.id = " + params.filters.entityid;
    }
    if (params && params.sorting && params.sorting.sort && params.filters && !params.filters.order) {
        sql += " order by " + params.sorting.sort;
    }
    else if (params && params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " DESC ";
    } else if (params && params.filters && params.filters.order.toLowerCase() === 'asc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " ASC ";
    }
    if (params && params.paging && params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + "," + params.paging.limitend;
    } else if (params && params.paging && params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            return callback(err.sqlMessage);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            log.error(err);
            callback(err, results);
        }
    });
};
CommonTypeModel.prototype.findOne = function (params, id, callback) {
    log.info("this is CommonLevelModel findOne function");
    var sql = this.tableOnly;
    log.info("this is CommonTypeModel select statement:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ct.id = ' + id;
    log.info("this is CommonTypeModel select statement:-" + sql);
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            return callback(err.sqlMessage);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            log.error(err);
            callback(err, results[0]);
        }
    });
};
CommonTypeModel.prototype.create = function (data, callback) {
    log.info("this is CommonLevelModel create function");
    this.dbMySQL.query('INSERT INTO common_types SET ?', data, function (err, result) {
        if (result) {
            log.info("CommonLevelModel data posting result" + result);
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CommonTypeModel.prototype.update = function (id, data, callback) {
    log.info("this is CommonLevelModel update function");
    this.dbMySQL.query('UPDATE common_types SET ? WHERE id = ' + id, data, function (err) {
        log.error(err);
        callback(err, data);
    });
};
CommonTypeModel.prototype.remove = function (id, callback) {
    log.info("this is CommonLevelModel remove function");
    this.dbMySQL.query('delete FROM common_types WHERE id = ' + id, callback);
};
CommonTypeModel.prototype.search = function (params, callback) {
    log.info("this is CommonLevelModel search function");
    var sql = this.tableOnly;
    log.info("this is CommonTypeModel select statement:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(ct.name) like '%" + params.name + "%'";
    }
    if (params.description) {
        sql += " and  lower(ct.description)  like '%" + params.description + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
module.exports = CommonTypeModel;


