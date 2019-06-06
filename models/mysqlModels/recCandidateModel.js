var connection = require('../../utils/db/mysqlConnect'),
    CandidateModel = require('./commonCandidateModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    candidate;
function RecCandidateModel() {
    candidate = new CandidateModel();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select rc.*,DATE_FORMAT(rc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from rec_candidate rc,common_candidate cc,rec_candidate_lead rcl,common_contact cco,course_batch cb,rec_candidate_login rcll where  rc.batchid=cb.id and rc.candidateid=cc.id and rc.leadid=rcl.id and rc.portalid=rcll.id and cc.contactid=cco.id';
    this.deatailTableSQL = "rc.id,cb.id as course_batch__id,cb.courseid as course_batch__courseid,cb.name as course_batch__name,DATE_FORMAT(cb.orientationdate,'%m-%d-%Y,%H:%i:%s') as course_batch__orientationdate,DATE_FORMAT(cb.startdate,'%m-%d-%Y,%H:%i:%s') as course_batch__startdate,DATE_FORMAT(cb.enddate,'%m-%d-%Y,%H:%i:%s') as course_batch__enddate,cc.id as common_candidate__id,cco.id as common_candidate__common_contact__id,cco.firstname as common_candidate__common_contact__firstname,cco.lastname as common_candidate__common_contact__lastname,cco.middlename as common_candidate__common_contact__middlename,cco.email as common_candidate__common_contact__email,cco.phone as common_candidate__common_contact__phone,cco.addressid as common_candidate__common_contact__addressid,cco.secondaryemail as common_candidate__common_contact__secondaryemail,cco.secondaryphone as common_candidate__common_contact__secondaryphone,cco.workemail as common_candidate__common_contact__workemail,cco.workphone as common_candidate__common_contact__workphone,cco.designation as common_candidate__common_contact__designation,cco.dob as common_candidate__common_contact__dob,cco.secondarycontactid as common_candidate__common_contact__secondarycontactid,cco.sourcecontactid as common_candidate__common_contact__sourcecontactid,cco.workaddressid as common_candidate__common_contact__workaddressid,cco.entrydate as common_candidate__common_contact__entrydate,cco.linkedin as common_candidate__common_contact__linkedin,cco.skype as common_candidate__common_contact__skype,cco.facebook as common_candidate__common_contact__facebook,cco.twitter as common_candidate__common_contact__twitter,cc.workstatusid as common_candidate__workstatusid,cc.highesteducation as common_candidate__highesteducation,cc.lastjobcompany as common_candidate__lastjobcompany,cc.lastjoblocation as common_candidate__lastjoblocation,DATE_FORMAT(cc.enrolldate,'%m-%d-%Y,%H:%i:%s') as common_candidate__enrolldate,rc.statusid,rcl.id as rec_candidate_lead__id,rcl.sourceid as rec_candidate_lead__sourceid,rcl.contactid as rec_candidate_lead__contactid,rcl.statusid as rec_candidate_lead__statusid,rcl.categoryid as rec_candidate_lead__categoryid,rcl.levelid as rec_candidate_lead__levelid,rcl.courseid as rec_candidate_lead__courseid,rcl.notes as rec_candidate_lead__notes,rcll.id as rec_candidate_login__id,rcll.uname as rec_candidate_login__uname,rcll.passwd as rec_candidate_login__passwd,DATE_FORMAT(rcll.lastlogin,'%m-%d-%Y,%H:%i:%s') as rec_candidate_login__lastlogin,rcll.logincount as rec_candidate_login__logincount,DATE_FORMAT(rcll.registereddate,'%m-%d-%Y,%H:%i:%s') as rec_candidate_login__registereddate,rc.notes,rc.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("rc.*", this.deatailTableSQL);
}
RecCandidateModel.prototype.updateRecCandidate = function (id, candidateInfo, callback) {
    this.dbMySQL.query('UPDATE rec_candidate SET ? WHERE id = ' + id, candidateInfo, function (err) {
        callback(err, candidateInfo);
    });
};
RecCandidateModel.prototype.createRecCandidate = function (candidateInfo, callback) {
    this.dbMySQL.query("insert into rec_candidate SET ?", candidateInfo, function (err, results) {
        if (results) {
            candidateInfo.id = results.insertId;
        }
        callback(err, candidateInfo);
    });
};
RecCandidateModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.candidateid) {
        sql += ' and cc.id = ' + params.filters.candidateid;
    }
    if (params.filters.batchid) {
        sql += ' and cb.id = ' + params.filters.batchid;
    }
    if (params.filters.contactid) {
        sql += ' and cco.id = ' + params.filters.contactid;
    }
    if (params.filters.firstname) {
        sql += " and cco.firstname like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += " and cco.email like '" + params.filters.email.toLowerCase() + "'";
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
RecCandidateModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and rc.id = ' + id;
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
RecCandidateModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.candidate) {
        candidate.update(data.candidate.id, data.candidate, function (err, candidateData) {
            if (err) {
                return callback(err);
            }
            data.candidateid = candidateData.data.id;
            delete data.candidate;
            self.createRecCandidate(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createRecCandidate(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
RecCandidateModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.candidate) {
                candidate.update(data.candidate.id, data.candidate, function (err, candidateData) {
                    if (err) {
                        return callback(err);
                    }
                    data.candidateid = candidateData.data.id;
                    delete data.candidate;
                    self.updateRecCandidate(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateRecCandidate(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }
    });
};
RecCandidateModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM rec_candidate WHERE id = ' + id, callback);
};
RecCandidateModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.firstname) {
        sql += " and cco.firstname like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and cco.email like '%" + params.email + "%'";
    }
    if (params.uname) {
        sql += " and  lower(rcll.uname) like '%" + params.uname + "%'";
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
module.exports = RecCandidateModel;

