var connection = require('../../utils/db/mysqlConnect');
function UserLoginLinkedinModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tabllOnly = 'SELECT ull.*,DATE_FORMAT(lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM user_login_linkedin ull where 1=1';
}
UserLoginLinkedinModel.prototype.find = function (params, callback) {
    var sql = this.tabllOnly;
    if (params.filters.username) {
        sql += " and username like '" + params.filters.username.toLowerCase() + "' ";
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
UserLoginLinkedinModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tabllOnly + '  and ull.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
UserLoginLinkedinModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login_linkedin SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginLinkedinModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE user_login_linkedin SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
UserLoginLinkedinModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM user_login_linkedin WHERE id = ' + id, callback);
};
UserLoginLinkedinModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM user_login_linkedin where username like '%" + params.username + "%' or email like '%" + params.email + "%'", callback);
};
module.exports = UserLoginLinkedinModel;
