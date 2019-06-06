var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function ClassRecordingModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cr.*,DATE_FORMAT(cr.classdate,"%m-%d-%Y,%H:%i:%s") as classdate,DATE_FORMAT(cr.lastmoddatetime,"%m-%d-%Y,%H:%i:%s") as lastmoddatetime from class_recording cr,subject s where cr.subjectid=s.id';
    this.deatailTableSQL = 'cr.id,s.id as subject__id,s.name as subject__name,s.categoryid as subject__categoryid,s.icon_class as subject__icon_class,s.description as subject__description,cr.description,cr.videoid,cr.link,cr.status,cr.filename,cr.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cr.*', this.deatailTableSQL);
}
ClassRecordingModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.subjectid) {
        sql += " and s.id =" + params.filters.subjectid;
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
ClassRecordingModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cr.id = ' + id;
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
ClassRecordingModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO class_recording SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
ClassRecordingModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE class_recording SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
ClassRecordingModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM class_recording WHERE id = ' + id, callback);
};
ClassRecordingModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and s.name like '%" + params.name + "%'";
    }
    if (params.filename) {
        sql += " and cr.filename like '%" + params.filename + "%'";
    }
    if (params.description) {
        sql += " and cr.description like '%" + params.description + "%'";
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
module.exports = ClassRecordingModel;
