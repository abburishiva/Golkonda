var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    jsonUtil = require('../../utils/jsonUtil'),
    log;
function CommonCategoryModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cc.*,DATE_FORMAT(cc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_category cc,common_entity ce where  cc.entityid= ce.id';
    this.deatailTableSQL = 'cc.id,cc.name,cc.display_name,ce.id as common_entity__id,ce.name as common_entity__name,ce.display_name as common_entity__displayname,ce.description as common_entity__description,cc.description,cc.enabled,DATE_FORMAT(cc.lastmoddatetime,"%D-%M-%Y %H:%i:%s") as lastmoddatetime,cc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cc.*', this.deatailTableSQL);
    log = new Logger();
    log.info("This is CommonCategoryModel Constructor...");
}
CommonCategoryModel.prototype.find = function (params, callback) {
    log.info("this is CommonCategoryModel find function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(cc.name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.entityid) {
        sql += " and ce.id =" + params.filters.entityid;
    }
    if (params && params.sorting && params.sorting.sort && params.filters && !params.filters.order) {
        sql += " order by " + params.sorting.sort;
    } else if (params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
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
        if (err) {
            return callback(err.sqlMessage);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
CommonCategoryModel.prototype.findOne = function (params, id, callback) {
    log.info("this is CommonCategoryModel findOne function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cc.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err.sqlMessage);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(err, results[0]);
        }
    });
};
CommonCategoryModel.prototype.create = function (data, callback) {
    log.info("this is CommonCategoryModel findOne function");
    log.info("data");
    log.info(data);
    this.dbMySQL.query('INSERT INTO common_category SET ?', data, function (err, result) {
        log.info("this is CommonCategoryModel create function");
        log.error(err);
        if (result) {
            data.id = result.insertId;
        }
        log.error(err);
        callback(err, data);
    });
};
CommonCategoryModel.prototype.update = function (id, data, callback) {
    log.info("this is CommonCategoryModel update function");
    log.info("update data" + data);
    this.dbMySQL.query('UPDATE common_category SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonCategoryModel.prototype.remove = function (id, callback) {
    log.info("this is CommonCategoryModel remove function");
    this.dbMySQL.query('delete FROM common_category WHERE id = ' + id, callback);
};
CommonCategoryModel.prototype.search = function (params, callback) {
    log.info("this is CommonCategoryModel remove function");
    log.info("params");
    log.info(params);
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(cc.name) like '%" + params.name + "%'";
    }
    if (params.description) {
        sql += " and  lower(cc.description)  like '%" + params.description + "%'";
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
module.exports = CommonCategoryModel;


