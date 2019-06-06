var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function MktCandidateAssignmentModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select mca.*,DATE_FORMAT(mca.lastmoddatetime,"%m-%d-%Y,%H:%i:%s") as lastmoddatetime from  mkt_candidate_assignment mca ,app_mgmt_employee ame,common_candidate cc,common_employee cem,common_contact cco where mca.mmid=ame.id and mca.candidateid=cc.id and ame.employeeid=cem.id and cc.contactid=cco.id';
    this.deatailTableSQL = 'mca.id,cc.id as common_candidate__id,cco.id as common_candidate__common_contact__id,cco.firstname as common_candidate__common_contact__firstname,cco.lastname as common_candidate__common_contact__lastname,cco.middlename as common_candidate__common_contact__middlename,cco.email as common_candidate__common_contact__email,cco.phone as common_candidate__common_contact__phone,cco.addressid as common_candidate__common_contact__addressid,cco.secondaryemail as common_candidate__common_contact__secondaryemail,cco.secondaryphone as common_candidate__common_contact__secondaryphone,cco.workemail as common_candidate__common_contact__workemail,cco.workphone as common_candidate__common_contact__workphone,cco.ssn as common_candidate__common_contact__ssn,cco.designation as common_candidate__common_contact__designation,cco.dob as common_candidate__common_contact__dob,cco.secondarycontactid as common_candidate__common_contact__secondarycontactid,cco.sourcecontactid as common_candidate__common_contact__sourcecontactid,cco.workaddressid as common_candidate__common_contact__workaddressid,cco.entrydate as common_candidate__common_contact__entrydate,cco.linkedin as common_candidate__common_contact__linkedin,cco.skype as common_candidate__common_contact__skype,cco.facebook as common_candidate__common_contact__facebook,cco. twitter as common_candidate__common_contact__twitter,cc.workstatusid as common_candidate__workstatusid,cc.highesteducation as common_candidate__highesteducation,cc.lastjoblocation as common_candidate__lastjoblocation,cc.enrolldate as common_candidate__enrolldate,ame.id as app_mgmt_employee__id,cem.id as app_mgmt_employee__common_employee__id,cem.contactid as app_mgmt_employee__common_employee__contactid,cem.hiredate as app_mgmt_employee__common_employee__hiredate,cem.startdate as app_mgmt_employee__common_employee__startdate,ame.appcompanyid as app_mgmt_employee__appcompanyid,ame.statusid as app_mgmt_employee__statusid,mca.statusid,mca.mmid,mca.email_account_id,mca.notes,mca.startdate,mca.enddate,mca.minrate,mca.relocation,mca.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('mca.*', this.deatailTableSQL);
}
MktCandidateAssignmentModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.candidateid) {
        sql += ' and mca.candidateid = ' + params.filters.candidateid;
    }
    if (params.filters.contactid) {
        sql += ' and cco.id = ' + params.filters.contactid;
    }
    if (params.filters.firstname) {
        sql += " and cco.firstname like '" + params.filters.firstname.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += " and cco.email like '" + params.filters.email.toLowerCase() + "'";
    }
    if (params.filters.phone) {
        sql += ' and cco.phone = ' + params.filters.phone;
    }
    if (params.filters.addressid) {
        sql += ' and cco.addressid = ' + params.filters.addressid;
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
MktCandidateAssignmentModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and mca.id = ' + id;
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
MktCandidateAssignmentModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO mkt_candidate_assignment SET ? ', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
MktCandidateAssignmentModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE mkt_candidate_assignment SET ? WHERE id= ' + id, data, function (err) {
        callback(err, data);
    });
};
MktCandidateAssignmentModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM  mkt_candidate_assignment WHERE id = ' + id, callback);
};
MktCandidateAssignmentModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.firstname) {
        sql += " and  (cco.firstname)  like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  (cco.email)  like '%" + params.email + "%'";
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
module.exports = MktCandidateAssignmentModel;