var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CommonCandidatePaperworkModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ccpw.*,DATE_FORMAT(ccpw.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM common_candidate_paperwork ccpw,common_paperwork cpw,common_candidate cc where ccpw.paperwork_id=cpw.id and ccpw.candidateid=cc.id';
    this.deatailTableSQL = 'ccpw.id,cc.id as common_candidate__id,cc.contactid as common_candidate__contactid,cc.workstatusid as common_candidate__workstatusid,cc.highesteducation as common_candidate__highesteducation,cc.lastjobcompany as common_candidate__lastjobcompany,cc.lastjoblocation as common_candidate__lastjoblocation,cc.enrolldate as common_candidate__enrolldate,cpw.id as common_paperwork__id,cpw.name as common_paperwork__name,cpw.display_name as common_paperwork__display_name,cpw.entityid as common_paperwork__entityid,ccpw.link,ccpw.notes,ccpw.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ccpw.*', this.deatailTableSQL);
}
CommonCandidatePaperworkModel.prototype.modelType = 'mySql';
CommonCandidatePaperworkModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.id) {
        sql += " and cc.id =" + params.filters.id;
    }
    if (params.filters.entityid) {
        sql += " and cpw.entityid =" + params.filters.entityid;
    }
    if (params.filters.name) {
        sql += " and lower(cpw.name) like '" + params.filters.name.toLowerCase() + "' ";
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
CommonCandidatePaperworkModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ccpw.id = ' + id;
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
CommonCandidatePaperworkModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO common_candidate_paperwork SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CommonCandidatePaperworkModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE common_candidate_paperwork SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonCandidatePaperworkModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM common_candidate_paperwork WHERE id = ' + id, callback);
};
CommonCandidatePaperworkModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.link) {
        sql += " and lower(ccpw.link) like '%" + params.link + "%'";
    }
    if (params.notes) {
        sql += " and  lower(ccpw.notes)  like '%" + params.notes + "%'";
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
module.exports = CommonCandidatePaperworkModel;


