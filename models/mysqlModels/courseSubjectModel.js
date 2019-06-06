var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CourseSubjectModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cs.*,DATE_FORMAT(cs.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from course_subject cs,course c,subject s where cs.courseid = c.id and cs.subjectid = s.id';
    this.deatailTableSQL = 'cs.id,c.id as course__id,c.name as course__name,c.alias as course__alias,c.description as course__description ,s.id as subject__id,s.categoryid as subject__categoryid,s.name as subject__name,s.description as subject__description,cs.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cs.*', this.deatailTableSQL);
}
CourseSubjectModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.courseid) {
        sql += ' and c.id =' + params.filters.courseid;
    }
    if (params.filters.subjectid) {
        sql += ' and s.id =' + params.filters.subjectid;
    }
    if (params.filters.name) {
        sql += " and c.name like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
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
CourseSubjectModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type === 'all') {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cs.id =' + id;
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
CourseSubjectModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_subject SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseSubjectModel.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            self.dbMySQL.query('UPDATE course_subject SET ? WHERE id = ' + id, data, function (err) {
                callback(err, {data: data, type: 'update'});
            });
        } else {
            self.create(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        }
    });
};
CourseSubjectModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_subject WHERE id = ' + id, callback);
};
CourseSubjectModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.alias) {
        sql += " and c.alias like '%" + params.alias + "%'";
    }
    if (params.name) {
        sql += " and lower(s.name) like '%" + params.name + "%'";
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
module.exports = CourseSubjectModel;