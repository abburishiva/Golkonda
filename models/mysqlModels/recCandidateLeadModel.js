var connection = require('../../utils/db/mysqlConnect'),
    ContactModel = require('./commonContactModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    contact;
function RecCandidateLeadModel() {
    contact = new ContactModel();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = "select rcl.* ,DATE_FORMAT(rcl.lastmoddatetime,'%m-%d-%Y,%H:%i:%s') as lastmoddatetime from rec_candidate_lead rcl ,course c, common_contact cco, lead_source ls,common_address ca  where rcl.courseid=c.id and rcl.contactid=cco.id and  rcl.sourceid=ls.id  and cco.addressid=ca.id";
    this.deatailTableSQL = "rcl.id,ls.id as lead_source__id,ls.type as lead_source__type,ls.description as lead_source__description,cco.id as common_contact__id,cco.firstname as common_contact__firstname ,cco.lastname as common_contact__lastname,cco.middlename as common_contact__middlename,cco.email as common_contact__email,cco.phone as common_contact__phone,ca.id as common_contact__common_address__id,ca.address1 as common_contact__common_address__address1,ca.address2 as common_contact__common_address__address2,ca.cityid as common_contact__common_address__cityid,ca.usercity as common_contact__common_address__usercity,ca.region as common_contact__common_address__region,ca.countryid as common_contact__common_address__countryid,rcl.statusid,rcl.categoryid,rcl.levelid,c.id as course__id, c.name as course__name,c.alias as course__alias,c.description as course__description,rcl.notes,rcl.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("rcl.*", this.deatailTableSQL);
}
RecCandidateLeadModel.prototype.updateRecCandidateLead = function (id, candidateInfo, callback) {
    this.dbMySQL.query('UPDATE rec_candidate_lead SET ? WHERE id = ' + id, candidateInfo, function (err) {
        callback(err, candidateInfo);
    });
};
RecCandidateLeadModel.prototype.createRecCandidateLead = function (candidateInfo, callback) {
    this.dbMySQL.query("insert into rec_candidate_lead SET ?", candidateInfo, function (err, results) {
        if (results) {
            candidateInfo.id = results.insertId;
        }
        callback(err, candidateInfo);
    });
};
RecCandidateLeadModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.contactid) {
        sql = sql + ' and cco.id = ' + params.filters.contactid;
    }
    if (params.filters.name) {
        sql = sql + " and cco.firstname like '" + params.filters.firstname.toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql = sql + " and cco.email like'" + params.filters.email.toLowerCase() + "' ";
    }
    if (params.filters.address) {
        sql = sql + " and ca.address1 like'" + params.filters.address1.toLowerCase() + "' ";
    }
    if (params.filters.region) {
        sql = sql + " and ca.region like'" + params.filters.region.toLowerCase() + "' ";
    }
    if (params.filters.courseid) {
        sql = sql + ' and c.id =' + params.filters.courseid;
    }
    if (params.sorting.sort) {
        sql = sql + " order by rcl." + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql = sql + " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql = sql + " limit " + params.paging.limitend;
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
RecCandidateLeadModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql = sql + ' and rcl.id = ' + id;
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
RecCandidateLeadModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.contact) {
        contact.update(data.contact.id, data.contact, function (err, contactData) {
            if (err) {
                return callback(err);
            }
            data.contactid = contactData.data.id;
            delete data.contact;
            self.createRecCandidateLead(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createRecCandidateLead(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
RecCandidateLeadModel.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.contact) {
                contact.update(data.contact.id, data.contact, function (err, contactData) {
                    if (err) {
                        return callback(err);
                    }
                    data.contactid = contactData.data.id;
                    delete data.contact;
                    self.updateRecCandidateLead(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateRecCandidateLead(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }
    });
};
RecCandidateLeadModel.prototype.remove = function (id, callback) {
    var sql = 'DELETE FROM rec_candidate_lead WHERE id = ' + id;
    this.dbMySQL.query(sql, callback);
};
RecCandidateLeadModel.prototype.search = function (params, callback) {
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
    if (params.name) {
        sql += " and c.name like '%" + params.name + "%'";
    }
    if (params.address1) {
        sql += " and  lower(ca.address1) like '%" + params.address1 + "%'";
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
module.exports = RecCandidateLeadModel;

