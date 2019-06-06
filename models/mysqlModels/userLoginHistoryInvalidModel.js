var connection = require('../../utils/db/mysqlConnect');
function UserLoginHistoryInvalidModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select ulh.*,DATE_FORMAT(ulh.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM user_login_history_invalid ulh where 1=1';
}
UserLoginHistoryInvalidModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.user_loginid) {
        sql += " AND ulh.user_loginid =" + params.filters.user_loginid;
    }
    if (params.filters.email) {
        sql += " AND ulh.email like '" + params.filters.email.toLowerCase() + "' ";
    }
    if (params.filters.user_agent) {
        sql += " AND ulh.user_agent like '" + params.filters.user_agent.toLowerCase() + "' ";
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, callback);
};
UserLoginHistoryInvalidModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' AND ulh.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
UserLoginHistoryInvalidModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login_history_invalid SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginHistoryInvalidModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_login_history_invalid SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserLoginHistoryInvalidModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM user_login_history_invalid WHERE id = ' + id, callback);
};
UserLoginHistoryInvalidModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("select * FROM user_login_history_invalid  where  email like '%" + params.email + "%'", callback);
};
module.exports = UserLoginHistoryInvalidModel;

