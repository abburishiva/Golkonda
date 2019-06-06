var connection = require('../../utils/db/mysqlConnect');
var moment = require("moment");
function UserLoginHistoryModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select ulh.* FROM user_login_history ulh WHERE 1=1 ';
}
UserLoginHistoryModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.history_loginid) {
        sql += " and lower(ulh.history_loginid) ='" + params.filters.history_loginid;
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
UserLoginHistoryModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and ulh.id = ' + id, callback);
};
UserLoginHistoryModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO user_login_history SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
UserLoginHistoryModel.prototype.updateEndDate = function (logoutParams, callback) {
    var self = this, date = moment().format('YYYY-MM-DD H:mm:ss');
    if (!logoutParams.ipAddress && !logoutParams.userAgent) {
        self.dbMySQL.query("SELECT max(id) FROM user_login_history  WHERE enddate is NULL and user_loginid = " + logoutParams.userId, function (err, data) {
            if (err) {
                callback({code: 500, message: "Error retrieving your loginid"});
            } else {
                self.dbMySQL.query("UPDATE user_login_history SET enddate='" + date + "' WHERE id = " + data[0]['max(id)'], function (err, data) {
                    if (err) {
                        callback({code: 500, message: "Error retrieving your maximum id"});
                    } else {
                        callback(null, data);
                    }
                });
            }
        });
    } else {
        self.dbMySQL.query("SELECT max(id) FROM user_login_history  WHERE enddate is NULL and  user_agent = '" + logoutParams.userAgent + "' and ip_address ='" + logoutParams.ipAddress + "' ", function (err, data) {
            if (err) {
                callback({code: 500, message: "Error retrieving your useragent"});
            } else {
                self.dbMySQL.query("UPDATE user_login_history SET enddate='" + date + "' WHERE id = " + data[0]['max(id)'], function (err, data) {
                    if (err) {
                        callback({code: 500, message: "Error retrieving your maximum id"});
                    } else {
                        callback(null, data);
                    }
                });
            }
        });
    }
};
UserLoginHistoryModel.prototype.updateLoginHistory = function (loginParams, callback) {
    var startDate = moment().format('YYYY-MM-DD H:mm:ss');
    this.dbMySQL.query("insert into user_login_history (user_loginid,user_agent,ip_address, startdate) values ('" + loginParams.loginId + "','" + loginParams.userAgent + "','" + loginParams.ipAddress + "','" + startDate + "')", callback);
};
UserLoginHistoryModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM user_login_history WHERE id = ' + id, callback);
};
UserLoginHistoryModel.prototype.search = function (req, callback) {
    this.dbMySQL.query("select * FROM user_login_history  where  ip_address like '%" + req.query.ipaddress + "%'", callback);
};
module.exports = UserLoginHistoryModel;