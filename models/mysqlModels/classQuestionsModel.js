var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function ClassQuestionsModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cq.*,DATE_FORMAT(cq.lastmoddatetime,"%m-%d-%Y,%H:%i:%s") as lastmoddatetime from class_questions cq,subject s where subjectid=s.id';
    this.deatailTableSQL = 'cq.id,s.id as subject__id,s.name as subject__name,s.icon_class as subject__icon_class,s.description as subject__description,cq.question,DATE_FORMAT(cq.lastmoddatetime,"%m-%d-%Y,%H:%i:%s") as lastmoddatetime,cq.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cq.*', this.deatailTableSQL);
}
ClassQuestionsModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.subjectid) {
        sql += ' and s.id = ' + params.filters.subjectid;
    }
    if (params.filters.name) {
        sql += " and s.name like '" + params.filters.name.toLowerCase() + "'";
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
ClassQuestionsModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cq.id = ' + id;
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
ClassQuestionsModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO class_questions SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
ClassQuestionsModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE class_questions SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
ClassQuestionsModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM class_questions WHERE id = ' + id, callback);
};
ClassQuestionsModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and lower(s.name) like '%" + params.name + "%'";
    }
    if (params.question) {
        sql += " and  (cq.question)  like '%" + params.question + "%'";
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
module.exports = ClassQuestionsModel;
