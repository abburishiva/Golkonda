var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CourseContentModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cc.*,DATE_FORMAT(cc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from course_content cc ,course c  where cc.courseid=c.id';
    this.deatailTableSQL = 'cc.id,c.id as course__id,c.name as course__name,c.alias as course__alias,c.description as course__description,cc.week,cc.morning,cc.evening,cc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cc.*", this.deatailTableSQL);
}
CourseContentModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.courseid) {
        sql += ' and cc.courseid IN(0,' + params.filters.courseid + ') ';
    }
    if (params.filters.week) {
        sql += " and lower(cc.week) like '" + params.filters.week.toString().toLowerCase() + "' ";
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
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
CourseContentModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and cc.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(null, results[0]);
        }
    });
};
CourseContentModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_content SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseContentModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course_content SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseContentModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_content WHERE id = ' + id, callback);
};
CourseContentModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.week) {
        sql += " and c.week like '%" + params.week + "%'";
    }
    if (params.alias) {
        sql += " and c.alias like '%" + params.alias + "%'";
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
module.exports = CourseContentModel;
