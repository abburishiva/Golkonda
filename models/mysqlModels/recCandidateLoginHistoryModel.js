var connection = require('../../utils/db/mysqlConnect');
function RecCandidateLoginHistoryModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT rcl.*,DATE_FORMAT(rcl.logoutdatetime,"%m-%d-%Y %H:%i:%s") as logoutdatetime,DATE_FORMAT(rcl.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM rec_candidate_login_history rcl where 1=1';
}
RecCandidateLoginHistoryModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.useragent) {
        sql += " and lower(rcl.useragent) like '" + params.filters.useragent.toLowerCase() + "'";
    }
    if (params.filters.ipaddress) {
        sql += " and rcl.ipaddress = '" + params.filters.ipaddress + "' ";
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
RecCandidateLoginHistoryModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and rcl.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
RecCandidateLoginHistoryModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO rec_candidate_login_history SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
RecCandidateLoginHistoryModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE rec_candidate_login_history SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
RecCandidateLoginHistoryModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM rec_candidate_login_history WHERE id = ' + id, callback);

};
RecCandidateLoginHistoryModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM rec_candidate_login_history  where useragent like '%" + params.useragent + "%'", callback);
};
module.exports = RecCandidateLoginHistoryModel;
