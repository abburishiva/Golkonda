var connection = require('../../utils/db/mysqlConnect');
function CourseModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cs.*,DATE_FORMAT(cs.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM course cs';
}
CourseModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.name) {
        sql += " where lower(cs.name) like '" + params.filters.name.toString().toLowerCase() + "' ";
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
CourseModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' where cs.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
CourseModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course WHERE id = ' + id, callback);
};
CourseModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM course  where lower(name) like '%" + params.name + "%' or lower(alias) like '%" + params.alias + "%'or lower(certificatetitle) like '%" + params.certificatetitle + "%'", callback);
};
module.exports = CourseModel;
