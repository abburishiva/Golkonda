var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function ClassNotes() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cn.*,DATE_FORMAT(cn.classdate,"%m-%d-%Y %H:%i:%s") as classdate,DATE_FORMAT(cn.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from class_notes cn,subject s where  cn.subjectid=s.id';
    this.deatailTableSQL = 'cn.id,s.id as subject__id,s.categoryid as subject__categoryid,s.name as subject__name,s.icon_class as subject__icon_class,s.description as subject__description,cn.notes';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cn.*", this.deatailTableSQL);
}
ClassNotes.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.subjectid) {
        sql += ' and s.id = ' + params.filters.subjectid;
    }
    if (params.filters.categoryid) {
        sql += ' and s.categoryid = ' + params.filters.categoryid;
    }
    if (params.filters.name) {
        sql += " and s.name like '" + params.filters.name.toLowerCase() + "'";
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
ClassNotes.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cn.id = ' + id;
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
ClassNotes.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO class_notes SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
ClassNotes.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE class_notes SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
ClassNotes.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM class_notes WHERE id = ' + id, callback);
};

ClassNotes.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM class_notes where notes like '%" + params.notes + "%'", callback);
};
module.exports = ClassNotes;

