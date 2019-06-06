var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    log;
function CommonLevelModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cl.*,DATE_FORMAT(cl.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_level cl,common_entity ce where cl.entityid= ce.id ';
    this.deatailTableSQL = 'cl.id,ce.id as common_entity__id,ce.name as common_entity__name,ce.display_name as common_entity__display_name,ce.description as common_entity__description,cl.name,cl.display_name,cl.description,cl.enabled,cl.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cl.*', this.deatailTableSQL);
    log = new Logger();
    log.info("This is CommonLevelModel Constructor...");
}
CommonLevelModel.prototype.find = function (params, callback) {
    log.info("this is CommonLevelModel find function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    log.info("this is CommonEntityModel select statement:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(cl.name) like " + "'" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.entityid) {
        sql += " and ce.id =" + params.filters.entityid;
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info("This is CommonLevelModel query function for find");
        log.info(results);
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
CommonLevelModel.prototype.findOne = function (params, id, callback) {
    log.info("this is CommonLevelModel findOne function");
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cl.id = ' + id;
    log.info("this is CommonEntityModel select statement:-" + sql);
    this.dbMySQL.query(sql, function (err, results) {
        log.info("This is CommonLevelModel query function for findOne");
        log.info(results);
        if (err) {
            log.error(err);
            return callback(err);
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
CommonLevelModel.prototype.create = function (data, callback) {
    log.info("this is CommonLevelModel create function");
    this.dbMySQL.query('INSERT INTO common_level SET ?', data, function (err, result) {
        if (result) {
            log.info("CommonLevelModel data posting result" + result);
            data.id = result.insertId;
        }
        log.error(err);
        callback(err, data);
    });
};
CommonLevelModel.prototype.update = function (id, data, callback) {
    log.info("this is CommonLevelModel update function");
    this.dbMySQL.query('UPDATE common_level SET ? WHERE id = ' + id, data, function (err) {
        log.error(err);
        callback(err, data);
    });
};
CommonLevelModel.prototype.remove = function (id, callback) {
    log.info("this is CommonLevelModel remove function");
    this.dbMySQL.query('delete FROM common_level WHERE id = ' + id, callback);
};
CommonLevelModel.prototype.search = function (params, callback) {
    log.info("this is CommonLevelModel search function");
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(cl.name) like '%" + params.name + "%'";
    }
    if (params.description) {
        sql += " and  lower(cl.description)  like '%" + params.description + "%'";
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
module.exports = CommonLevelModel;
