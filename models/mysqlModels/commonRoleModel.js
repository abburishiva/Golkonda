var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CommonRoleModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cr.*,DATE_FORMAT(cr.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_role cr,common_entity ce where cr.entityid= ce.id';
    this.deatailTableSQL = 'cr.id,ce.id as common_entity__id,ce.name as common_entity__name,ce.display_name as common_entity__displayname,ce.description as common_entity__description,cr.name,cr.display_name,cr.description';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cr.*', this.deatailTableSQL);
}
CommonRoleModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(cr.name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.entityid) {
        sql += " and ce.id=" + params.filters.entityid;
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
CommonRoleModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cr.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
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
CommonRoleModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO common_role SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CommonRoleModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE common_role SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonRoleModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM common_role WHERE id = ' + id, callback);
};
CommonRoleModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(cr.name) like '%" + params.name + "%'";
    }
    if (params.description) {
        sql += " and  lower(cr.description)  like '%" + params.description + "%'";
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
module.exports = CommonRoleModel;

