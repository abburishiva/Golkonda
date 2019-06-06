var connection = require('../../utils/db/mysqlConnect');
function UserLoginGoogleModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ulg.*,DATE_FORMAT(lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM user_login_google ulg where 1=1';
}
UserLoginGoogleModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.username) {
        sql += " and ulg.username like '" + params.filters.username.toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += " AND ulg.email like '" + params.filters.email.toLowerCase() + "' ";
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
UserLoginGoogleModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and ulg.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
UserLoginGoogleModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login_google SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginGoogleModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_login_google SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserLoginGoogleModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM user_login_google WHERE id = ' + id, callback);
};
UserLoginGoogleModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("select * FROM user_login_google  where username like '%" + params.username + "%' or email like '%" + params.email + "%'", callback);
};
module.exports = UserLoginGoogleModel;
