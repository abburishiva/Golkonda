var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function ClassMockModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cmc.*,DATE_FORMAT(cmc.classdate,"%m-%d-%Y %H:%i:%s") as classdate,DATE_FORMAT(cmc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from class_mock cmc,common_category cat,subject s where  cmc.categoryid=cat.id  and cmc.subjectid=s.id';
    this.deatailTableSQL = 'cmc.id,s.id as subject__id,s.categoryid as subject__categoryid,s.name as subject__name,s.icon_class as subject__icon_class,s.description as subject__description,cmc.title,cmc. videoid,cat.id as common_category__id,cat.name as common_category__name,cat.displayname as common_category__displayname,cat.description as common_category__description,cat.enabled as common_category__enabled,cmc.notes,cmc.statusid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cmc.*", this.deatailTableSQL);
}
ClassMockModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.subjectid) {
        sql += ' and s.id = ' + params.filters.subjectid;
    }
    if (params.filters.categoryid) {
        sql += ' and s.categoryid = ' + params.filters.categoryid;
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
ClassMockModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cmc.id = ' + id;
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
ClassMockModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO class_mock SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
ClassMockModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE class_mock SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
ClassMockModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM class_mock WHERE id = ' + id, callback);
};
ClassMockModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.displayname) {
        sql += " and cat.displayname like '%" + params.displayname + "%'";
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name + "%'";
    }
    if (params.title) {
        sql += " and  (cmc.title)  like '%" + params.title + "%'";
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
module.exports = ClassMockModel;
