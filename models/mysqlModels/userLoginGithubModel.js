var connection = require('../../utils/db/mysqlConnect');
function UserLoginGithubModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ulg.*,DATE_FORMAT(ulg.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM user_login_github  ulg where 1=1';
}
UserLoginGithubModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.username) {
        sql += " and username  like '" + params.filters.username.toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += " and email like '" + params.filters.email.toLowerCase() + "' ";
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
UserLoginGithubModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and ulg.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
UserLoginGithubModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login_github SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginGithubModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_login_github SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserLoginGithubModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM user_login_github WHERE id = ' + id, callback);
};
UserLoginGithubModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("select * FROM user_login_github  where username like '%" + params.username + "%' or email like '%" + params.email + "%'", callback);
};
module.exports = UserLoginGithubModel;
