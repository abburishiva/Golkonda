var connection = require('../../utils/db/mysqlConnect');
function CourseFaqModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cf.*,DATE_FORMAT(cf.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from course_faq cf where 1=1 ';
}
CourseFaqModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.courseid) {
        sql += ' and cf.courseid IN (0,' + params.filters.courseid + ') ';
    }
    if (params.filters.question) {
        sql += ' and lower(cf.question) like "' + params.filters.question.toLowerCase() + '"';
    }
    if (params.filters.answer) {
        sql += ' and lower(cf.answer) like "' + params.filters.answer.toLowerCase() + '"';
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
CourseFaqModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' AND cf.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
CourseFaqModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_faq SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseFaqModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course_faq SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseFaqModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_faq WHERE id = ' + id, callback);
};
CourseFaqModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM course_faq  where category like '%" + params.category + "%' or answer like '%" + params.answer + "%' or question like '%" + params.question + "%'", callback);
};
module.exports = CourseFaqModel;