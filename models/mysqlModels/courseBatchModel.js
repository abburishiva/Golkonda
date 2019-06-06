var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CourseBatchModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cb.*,DATE_FORMAT(cb.orientationdate,"%m-%d-%Y %H:%i:%s") as orientationdate,DATE_FORMAT(cb.startdate,"%m-%d-%Y %H:%i:%s") as startdate,DATE_FORMAT(cb.enddate,"%m-%d-%Y %H:%i:%s") as enddate,DATE_FORMAT(cb.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from course_batch cb,course c where cb.courseid=c.id';
    this.deatailTableSQL = 'cb.id,c.id as course__id,c.name as course__name,c.alias as course__alias,c.description as course__description,cb.name,cb.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cb.*", this.deatailTableSQL);
}
CourseBatchModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.courseid) {
        sql += ' and c.id IN(0,' + params.filters.courseid + ') ';
    }
    if (params.filters.name) {
        sql += " and c.name like '" + params.filters.name.toLowerCase() + "'";
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
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
CourseBatchModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and cb.id = ' + id;
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
CourseBatchModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_batch SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseBatchModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE course_batch SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CourseBatchModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_batch WHERE id = ' + id, callback);
};
CourseBatchModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and c.name like '%" + params.name + "%'";
    }
    if (params.alias) {
        sql += " and  lower(c.alias) like '%" + params.alias + "%'";
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
module.exports = CourseBatchModel;