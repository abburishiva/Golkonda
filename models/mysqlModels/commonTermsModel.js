var connection = require('../../utils/db/mysqlConnect');
function CommonTermsModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ct.* FROM common_terms ct';
}
CommonTermsModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.name) {
        sql += " and lower(ct.name) like '" + params.filters.name.toLowerCase() + "' ";
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
            callback(err);
        } else {
            callback(err, results);
        }
    });
};
CommonTermsModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    sql += ' where ct.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            callback(err);
        } else {
            callback(err, results[0]);
        }
    });
};
CommonTermsModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO common_terms SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CommonTermsModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE common_terms SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonTermsModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM common_terms WHERE id = ' + id, callback);
};
module.exports = CommonTermsModel;


