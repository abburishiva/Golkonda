var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function UserLoginModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select ul.*,DATE_FORMAT(ul.lastmoddatetime,"%m-%d-%Y,%H:%i:%s") as lastmoddatetime from user_login ul,common_types ct where ul.login_type_id=ct.id';
    this.deatailTableSQL = 'ul.id,ul.login_id,ul.count,ct.id as common_types__id,ct.entityid as common_types__entityid,ct.name as common_types__name,ct.displayname as common_types__displayname,ct.description as common_types__description';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ul.*', this.deatailTableSQL);
}
UserLoginModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.login_id) {
        sql += " and ul.login_id =" + params.filters.login_id;
    }
    if (params.filters.name) {
        sql += " and ct.name like '" + params.filters.name + "'";
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
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
UserLoginModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ul.id = ' + id;
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
UserLoginModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_login SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserLoginModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM user_login WHERE id = ' + id, callback);
};
UserLoginModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(ct.name) like '%" + params.name + "%'";
    }
    if (params.displayname) {
        sql += " and  lower(ct.displayname) like '%" + params.displayname + "%'";
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
module.exports = UserLoginModel;

