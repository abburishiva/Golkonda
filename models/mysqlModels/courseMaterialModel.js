var connection = require('../../utils/db/mysqlConnect');
function CourseMaterialModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cm.* from course_material cm where 1=1';
}
CourseMaterialModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.courseid) {
        sql += ' and cm.courseid IN (0,' + params.filters.courseid + ') ';
    }
    if (params.filters.subjectid) {
        sql += ' and cm.subjectid IN (0,' + params.filters.subjectid + ') ';
    }
    if (params.filters.name) {
        sql += " and lower(cm.name) like '" + params.filters.name.toString().toLowerCase() + "' ";
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
CourseMaterialModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' AND cm.id = ' + id, function (err, result) {

        callback(err, result[0]);
    });
};
CourseMaterialModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_material SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseMaterialModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course_material SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseMaterialModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_material WHERE id = ' + id, callback);
};
CourseMaterialModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM course_material  where name like '%" + params.name + "%' or description like '%" + params.description + "%'", callback);
};
module.exports = CourseMaterialModel;