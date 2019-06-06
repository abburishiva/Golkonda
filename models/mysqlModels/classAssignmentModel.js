var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function ClassAssignmentModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ca.*,DATE_FORMAT(ca.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM class_assignment ca ,subject s where ca.subjectid=s.id';
    this.deatailTableSQL = 'ca.id,s.id as subject__id,s.name as subject__name,s.icon_class as subject__icon_class,s.description as subject__description,ca.question,ca.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ca.*', this.deatailTableSQL);
}
ClassAssignmentModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.subjectid) {
        sql += ' and  s.id = ' + params.filters.subjectid;
    }
    if (params.filters.name) {
        sql += " and  s.name like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.question) {
        sql += " and  ca.question like '" + params.filters.question.toLowerCase() + "'";
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
ClassAssignmentModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ca.id = ' + id;
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
ClassAssignmentModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO class_assignment SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
ClassAssignmentModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE class_assignment SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
ClassAssignmentModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM class_assignment WHERE id = ' + id, callback);
};
ClassAssignmentModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name + "%'";
    }
    if (params.question) {
        sql += " and  (ca.question)  like '%" + params.question + "%'";
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
module.exports = ClassAssignmentModel;
