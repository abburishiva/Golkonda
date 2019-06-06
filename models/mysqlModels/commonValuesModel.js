var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    jsonUtil = require('../../utils/jsonUtil'),
    log;
function CommonValuesModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT  ct.* FROM common_values ct, common_entity ce where ct.entityid = ce.id';
    this.deatailTableSQL = 'ct.id,ce.id as common_entity__id,ce.name as common_entity__name,ce.display_name as common_entity__displayname,ce.description as common_entity__description,ct.lastmoddatetime';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ct.*', this.deatailTableSQL);
    log = new Logger();
    log.info("This is CommonValuesModel Constructor...");
}
CommonValuesModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.entityid) {
        sql += " and ce.id = " + params.filters.entityid;
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + "," + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info("info at commonValues model find method and query ");
        if (err) {
            log.error(err);
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            log.error(err);
            callback(err, results);
        }
    });
};
CommonValuesModel.prototype.findOne = function (params, id, callback) {
    log.info("info at commonValues model findOne method and params");
    var sql = this.tableOnly;
    sql += ' and ct.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        log.info("info at commonValues model findOne method and query ");
        if (err) {
            log.error(err);
            callback(err);
        } else {
            callback(err, results[0]);
        }
    });
};
CommonValuesModel.prototype.create = function (data, callback) {
    log.info("info at commonValues model create method and data");
    this.dbMySQL.query('INSERT INTO common_values SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        log.info("info at commonValues model create method and results ");
        callback(err, data);
    });
};

CommonValuesModel.prototype.update = function (id, data, callback) {
    log.info("info at commonValues model update method and data ");
    this.dbMySQL.query('UPDATE common_values SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonValuesModel.prototype.remove = function (id, callback) {
    log.info("info at commonValues model remove method and data");
    this.dbMySQL.query('delete FROM common_values WHERE id = ' + id, callback);
};
module.exports = CommonValuesModel;


