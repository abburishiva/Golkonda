var connection = require('../../utils/db/mysqlConnect'),
    CommonCandidateModel = require('./commonCandidateModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    cc;
function MktCandidateModel() {
    cc = new CommonCandidateModel();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select mc.*,DATE_FORMAT(mc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from mkt_candidate mc,common_candidate cc,common_contact cco where mc.candidateid=cc.id and cc.contactid=cco.id';
    this.deatailTableSQL = 'mc.id,cc.id as common_candidate__id,cco.id as common_candidate__common_contact__id,cco.firstname as common_candidate__common_contact__firstname,cco.lastname as common_candidate__common_contact__lastname,cco.middlename as common_candidate__common_contact__middlename,cco.email as common_candidate__common_contact__email,cco.phone as common_candidate__common_contact__phone,cco.addressid as common_candidate__common_contact__addressid,cco.secondaryemail as common_candidate__common_contact__secondaryemail,cco.secondaryphone as common_candidate__common_contact__secondaryphone,cco.workemail as common_candidate__common_contact__workemail,cco.workphone as common_candidate__common_contact__workphone,cco.ssn as common_candidate__common_contact__ssn,cco.designation as common_candidate__common_contact__designation,cco.dob as common_candidate__common_contact__dob,cco.secondarycontactid as common_candidate__common_contact__secondarycontactid,cco.sourcecontactid as common_candidate__common_contact__sourcecontactid,cco.workaddressid as common_candidate__common_contact__workaddressid,DATE_FORMAT(cco.entrydate,"%m-%d-%Y %H:%i:%s") as common_candidate__common_contact__entrydate,cco.linkedin as common_candidate__common_contact__linkedin,cco.skype as common_candidate__common_contact__skype,cco.facebook as common_candidate__common_contact__facebook,cco. twitter as common_candidate__common_contact__twitter,cc.workstatusid as common_candidate__workstatusid, cc.highesteducation as common_candidate__highesteducation,cc.lastjobcompany as common_candidate__lastjobcompany,cc.lastjoblocation as common_candidate__lastjoblocation,DATE_FORMAT(cc.enrolldate,"%m-%d-%Y %H:%i:%s") as common_candidate__enrolldate,mc.statusid,mc.leadid,mc.notes,mc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('mc.*', this.deatailTableSQL);
}
MktCandidateModel.prototype.updateMktCandidate = function (id, mktInfo, callback) {
    this.dbMySQL.query('UPDATE mkt_candidate SET ? WHERE id = ' + id, mktInfo, function (err) {
        callback(err, mktInfo);
    });
};
MktCandidateModel.prototype.createMktCandidate = function (mktInfo, callback) {
    this.dbMySQL.query("insert into mkt_candidate SET ?", mktInfo, function (err, results) {
        if (results) {
            mktInfo.id = results.insertId;
        }
        callback(err, mktInfo);
    });
};
MktCandidateModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.candidateid) {
        sql += " and cc.id =" + params.filters.candidateid;
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
        sql += " and cco.phone = '" + params.filters.phone + "'";
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
MktCandidateModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and mc.id = ' + id;
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
MktCandidateModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.candidate) {
        cc.update(data.candidate.id, data.candidate, function (err, candidateData) {
            if (err) {
                return callback(err);
            }
            data.candidateid = candidateData.data.id;
            delete data.candidate;
            self.createMktCandidate(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createMktCandidate(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
MktCandidateModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.candidate) {
                cc.update(data.candidate.id, data.candidate, function (err, candidateData) {
                    if (err) {
                        return callback(err);
                    }
                    data.candidateid = candidateData.data.id;
                    delete data.candidate;
                    self.updateMktCandidate(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateMktCandidate(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }

    });
};
MktCandidateModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM mkt_candidate WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
MktCandidateModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.firstname) {
        sql += " and  lower(cco.firstname) like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  (cco.mail)  like '%" + params.email + "%'";
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
module.exports = MktCandidateModel;

