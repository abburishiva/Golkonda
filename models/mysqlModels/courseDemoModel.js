var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CourseDemoModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cd.*,DATE_FORMAT(cd.lastmoddatetime,"%m-%d-%Y,%H:%i:%s") as lastmoddatetime from course_demo cd ,course c  where cd.courseid=c.id';
    this.deatailTableSQL = 'cd.id,c.id as course__id,c.name as course__name,c.alias as course__alias,c.description as course__description,cd.videoid,cd.title,cd.description,cd.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cd.*", this.deatailTableSQL);
}
CourseDemoModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.courseid) {
        sql += ' and cd.courseid IN(0,' + params.filters.courseid + ')';
    }
    if (params.filters.title) {
        sql += " and lower(cd.title) like '" + params.filters.title.toLowerCase() + "' ";
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
CourseDemoModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and cd.id = ' + id;
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
CourseDemoModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_demo SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseDemoModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course_demo SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseDemoModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_demo WHERE id = ' + id, callback);
};
CourseDemoModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.alias) {
        sql += " and c.alias like '%" + params.alias + "%'";
    }
    if (params.name) {
        sql += " and  lower(c.name) like '%" + params.name + "%'";
    }
    if (params.title) {
        sql += " and  (cd.title)  like '%" + params.title + "%'";
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
module.exports = CourseDemoModel;
