var connection = require('../../utils/db/mysqlConnect');
function UserLoginFacebookModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select ulf.*,DATE_FORMAT(ulf.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM user_login_facebook ulf where 1=1 ';
}
UserLoginFacebookModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.username) {
        sql += " and ulf.username  like '" + params.filters.username.toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += " and ulf.email  like '" + params.filters.email.toLowerCase() + "' ";
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
UserLoginFacebookModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and  ulf.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
UserLoginFacebookModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login_facebook SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginFacebookModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_login_facebook SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserLoginFacebookModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM user_login_facebook WHERE id = ' + id, callback);
};
UserLoginFacebookModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM user_login_facebook  where username like '%" + params.username + "%' or email like '%" + params.email + "%' ", callback);
};
module.exports = UserLoginFacebookModel;