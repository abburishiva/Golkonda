var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function ClassMockCandidateModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cmc.*,DATE_FORMAT(cmc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from class_mock_candidate cmc ,class_mock cm,common_candidate cc,common_contact cco  where cmc.mockid=cm.id  and cmc.candidateid=cc.id and cc.contactid=cco.id';
    this.deatailTableSQL = "cmc.id ,cc.id as common_candidate__id,cco.id as common_candidate__common_contact__id,cco.firstname as common_candidate__common_contact__firstname,cco.lastname as common_candidate__common_contact__lastname,cco.middlename as common_candidate__common_contact__middlename,cco.email as common_candidate__common_contact__email,cco.phone as common_candidate__common_contact__phone,cco.addressid as common_candidate__common_contact__addressid,cco.secondaryemail as common_candidate__common_contact__secondaryemail,cco.secondaryphone as common_candidate__common_contact__secondaryphone,cco.workemail as common_candidate__common_contact__workemail,cco.workphone as common_candidate__common_contact__workphone,cco.ssn as common_candidate__common_contact__ssn,cco.designation as common_candidate__common_contact__designation,cco.dob as common_candidate__common_contact__dob,cco.secondarycontactid as common_candidate__common_contact__secondarycontactid,cco.sourcecontactid as common_candidate__common_contact__sourcecontactid,cco.workaddressid as common_candidate__common_contact__workaddressid, DATE_FORMAT(cco.entrydate,'%m-%d-%Y %H:%i:%s') as common_candidate__common_contact__entrydate,cco.linkedin as common_candidate__common_contact__linkedin,cco.skype as common_candidate__common_contact__skype,cco.facebook as common_candidate__common_contact__facebook,cco. twitter as common_candidate__common_contact__twitter,cc.workstatusid as common_candidate__workstatusid,cc.highesteducation as common_candidate__highesteducation,cc.lastjoblocation as common_candidate__lastjoblocation, DATE_FORMAT(cc.enrolldate,'%m-%d-%Y %H:%i:%s') as common_candidate__enrolldate,cm.id as class_mock__id,cm.subjectid as class_mock__subjectid,cm.title as class_mock__title,cm.statusid as class_mock__statusid,DATE_FORMAT(cm.classdate,'%m-%d-%Y %H:%i:%s')  as class_mock__classdate,cm.videoid as class_mock__videoid,cm.type as class_mock__types,cm.categoryid as class_mock__categoryid,cm.notes as class_mock__notes,cmc.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace('cmc.*', this.deatailTableSQL);
}
ClassMockCandidateModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.candidateid) {
        sql += ' and cc.id = ' + params.filters.candidateid;
    }
    if (params.filters.name) {
        sql += " and cco.firstname like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += " and cco.email like '" + params.filters.email.toLowerCase() + "'";
    }
    if (params.filters.phone) {
        sql += " and cco.phone = '" + params.filters.phone + "'";
    }
    if (params.filters.subjectid) {
        sql += ' and cm.subjectid = ' + params.filters.subjectid;
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
ClassMockCandidateModel.prototype.findOne = function (params, id, callback) {
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
ClassMockCandidateModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO class_mock_candidate SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
ClassMockCandidateModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE class_mock_candidate SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
ClassMockCandidateModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM class_mock_candidate WHERE id = ' + id, callback);
};
ClassMockCandidateModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.title) {
        sql += " and lower(cm.title) like '%" + params.title + "%'";
    }
    if (params.firstname) {
        sql += " and cco.firstname like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and cco.email like '%" + params.email + "%'";
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
module.exports = ClassMockCandidateModel;
