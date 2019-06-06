var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function UserRoleModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select ur.* ,DATE_FORMAT(ur.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM user_role ur,common_role cr,common_entity ce,user_login ul where ur.roleid=cr.id and ur.userid=ul.id and cr.entityid=ce.id ';
    this.deatailTableSQL = 'ur.id,ul.id as user_login__id,ul.login_id as user_login__login_id,ul.login_type_id as user_login__login_type_id,ul.statusid as user_login__statusid, ul.count as user_login__count,cr.id as common_role__id,ce.id as common_role__common_entity__id,ce.name as common_role__common_entity__name,ce.displayname as common_role__common_entity__diplayname,ce.description as common_role__common_entity__discription,cr.name as common_role__name,cr.displayname as common_role__displayname,cr.description as common_role__description';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ur.*', this.deatailTableSQL);
}
UserRoleModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.userid) {
        sql += " and ul.id = " + params.filters.userid;
    }
    if (params.filters.login_id) {
        sql += " and ul.login_id = " + params.filters.login_id;
    }
    if (params.filters.roleid) {
        sql += " and cr.id =" + params.filters.roleid;
    }
    if (params.filters.name) {
        sql += " and cr.name like '" + params.filters.name + "'";
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
UserRoleModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and ur.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(null, results[0]);
        }
    });
};
UserRoleModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_role SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserRoleModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_role SET ? WHERE userid = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserRoleModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM user_role WHERE userid = ' + id, callback);
};
UserRoleModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.diplayname) {
        sql += " and  lower(ce.diplayname) like '%" + params.diplayname + "%'";
    }
    if (params.name) {
        sql += " and  lower(cr.name) like '%" + params.name + "%'";
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
module.exports = UserRoleModel;


