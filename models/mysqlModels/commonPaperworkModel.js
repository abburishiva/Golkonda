var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CommonPaperworkModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT cpw.*,DATE_FORMAT(cpw.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_paperwork cpw,common_entity ce where cpw.entityid= ce.id ';
    this.deatailTableSQL = 'cpw.id,ce.id as common_entity__id,ce.name as common_entity__name,ce.displayname as common_entity__displayname,ce.description as common_entity__description,cpw.name,cpw.display_name,cpw.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cpw.*', this.deatailTableSQL);
}
CommonPaperworkModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(cpw.name) like " + "'" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.entityid) {
        sql += " and ce.id =" + params.filters.entityid;
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
CommonPaperworkModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cpw.id = ' + id;
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
CommonPaperworkModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO common_paperwork SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CommonPaperworkModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE common_paperwork SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonPaperworkModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM common_paperwork WHERE id = ' + id, callback);
};
CommonPaperworkModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(cpw.name) like '%" + params.name + "%'";
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
module.exports = CommonPaperworkModel;
