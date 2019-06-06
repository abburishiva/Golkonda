var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    CommonContactModel = require('./commonContactModel'),
    cc;
function MktCandidateLeadModel() {
    cc = new CommonContactModel();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select DISTINCT mkl.*,DATE_FORMAT(mkl.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from mkt_candidate_lead mkl,common_contact cc,lead_source ls where mkl.contactid=cc.id and  mkl.sourceid=ls.id';
    this.deatailTableSQL = 'mkl.id,ls.id as lead_source__id,ls.type as lead_source__type,ls.description as lead_source__description,cc.id as common_contact__id,cc.firstname as common_contact__firstname,cc.middlename as common_contact__middlename,cc.email as common_contact__mail,cc.phone as common_contact__phone,cc.addressid as common_contact__addressid,cc.secondaryemail as common_contact__secondaryemail,cc.secondaryphone as common_contact__secondaryphone,cc.workemail as common_contact__workemail,cc.workphone as common_contact__workphone,cc.designation as common_contact__designation,cc.dob as common_contact__dob,cc.secondarycontactid as common_contact__secondarycontactid,cc.sourcecontactid as common_contact__sourcecontactid,DATE_FORMAT(cc.entrydate,"%m-%d-%Y %H:%i:%s") as common_contact__entrydate,cc.workaddressid as  common_contact__workaddressid,cc.linkedin as common_contact__linkedin,cc.skype as common_contact__skype,cc.facebook as common_contact__facebook,cc.twitter as common_contact__twitter,mkl.appcompanyid,mkl.notes,mkl.appcompanyid,mkl.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('mkl.*', this.deatailTableSQL);
}
MktCandidateLeadModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.contactid) {
        sql += ' and mkl.contactid =' + params.filters.contactid;
    }
    if (params.filters.firstname) {
        sql += " and cc.firstname like '" + params.filters.firstname + "'";
    }
    if (params.filters.email) {
        sql += " and cc.email like '" + params.filters.email + "'";
    }
    if (params.filters.phone) {
        sql += " and cc.phone ='" + params.filters.phone + "'";
    }
    if (params.sorting.sort) {
        sql = sql + " order by mkl." + params.sorting.sort;
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
MktCandidateLeadModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type === 'all') {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and mkl.id =' + id;
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
MktCandidateLeadModel.prototype.createMktLead = function (data, callback) {
    this.dbMySQL.query('INSERT INTO mkt_candidate_lead SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
MktCandidateLeadModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.contact) {
        cc.update(data.contact.id, data.contact, function (err, contactData) {
            if (err) {
                return callback(err);
            }
            data.contactid = contactData.data.id;
            delete data.contact;
            self.createMktLead(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createMktLead(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
MktCandidateLeadModel.prototype.updateMktLead = function (id, mktCandidateInfo, callback) {
    this.dbMySQL.query('UPDATE mkt_candidate_lead SET ? WHERE id = ' + id, mktCandidateInfo, function (err) {
        callback(err, mktCandidateInfo);
    });
};
MktCandidateLeadModel.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.contact) {
                cc.update(data.contact.id, data.contact, function (err, contactData) {
                    if (err) {
                        return callback(err);
                    }
                    data.contactid = contactData.id;
                    delete data.contact;
                    self.updateMktLead(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateMktLead(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.createMktLead(data, function (err, result) {
                callback(err, result);
            });
        }
    });
};
MktCandidateLeadModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM mkt_candidate_lead WHERE id = ' + id, callback);
};
MktCandidateLeadModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.notes) {
        sql += " and mcl.notes like '%" + params.notes + "%'";
    }
    if (params.firstname) {
        sql += " and  lower(cc.firstname) like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  lower(cc.email) like '%" + params.email + "%'";
    }
    if (params.alias) {
        sql += " and  (amc.alias)  like '%" + params.alias + "%'";
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
module.exports = MktCandidateLeadModel;



