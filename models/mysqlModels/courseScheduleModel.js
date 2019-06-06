var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CourseScheduleModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT csc.*,DATE_FORMAT(csc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM course_schedule csc,course c where csc.courseid=c.id';
    this.deatailTableSQL = 'csc.id,c.id as course__id,c.name as course__name,c.alias as course__alias,c.description as course__description,csc.day,csc.morning,csc.evening,csc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('csc.*', this.deatailTableSQL);
}
CourseScheduleModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.courseid) {
        sql += ' AND c.id IN (0,' + params.filters.courseid + ')';
    }
    if (params.filters.day) {
        sql += " AND lower(csc.day) like '" + params.filters.day.toLowerCase() + "' ";
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    }
    if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
CourseScheduleModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and csc.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(err, results[0]);
        }
    });
};
CourseScheduleModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_schedule SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseScheduleModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course_schedule SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseScheduleModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_schedule WHERE id = ' + id, callback);
};
CourseScheduleModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.day) {
        sql += " and csc.day like '%" + params.day + "%'";
    }
    if (params.name) {
        sql += " and  lower(c.name) like '%" + params.name + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
module.exports = CourseScheduleModel;


