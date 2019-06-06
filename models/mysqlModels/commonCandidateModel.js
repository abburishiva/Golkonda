var connection = require('../../utils/db/mysqlConnect'),
    ContactModel = require('./commonContactModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    contact;
function CommonCandidateModel() {
    contact = new ContactModel();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cc.* ,DATE_FORMAT(cc.enrolldate,"%m-%d-%Y %H:%i:%s") as common_contact__enrolldate,DATE_FORMAT(cc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from common_candidate cc , common_contact cco,common_company cap,lookup_city lc,lookup_education le, common_address ca  where cc.contactid = cco.id and cc.lastjobcompany =cap.id and cc.lastjoblocation =lc.id and cc.highesteducation=le.id and cco.addressid=ca.id';
    this.deatailTableSQL = 'cc.id,cco.id as common_contact__id,cco.firstname as common_contact__firstname,cco.lastname as common_contact__lastname,cco.middlename as common_contact__middlename,cco.email as common_contact__email,cco.phone as common_contact__phone,ca.id as common_contact__common_address__id,ca.address1 as common_contact__common_address__address1,ca.address2 as common_contact__common_address__address2,ca.cityid as common_contact__common_address__cityid,ca.usercity as common_contact__common_address__usercity,ca.region as common_contact__common_address__region,ca.countryid as common_contact__common_address__countryid,cco.secondaryemail as common_contact__secondaryemail,cco.secondaryphone as common_contact__secondaryphone,cco.workemail as common_contact__workemail,cco.workphone as common_contact__workphone,cco.designation as common_contact__designation,DATE_FORMAT(cco.dob,"%m-%d-%Y %H:%i:%s") as common_contact__dob,cco.secondarycontactid as common_contact__secondarycontactid,cco.sourcecontactid as common_contact__sourcecontactid,cco.entrydate as common_contact__entrydate,cco.workaddressid as  common_contact__workaddressid,cco.linkedin as common_contact__linkedin,cco.skype as common_contact__skype,cco.facebook as common_contact__facebook, cco.twitter as common_contact__twitter,le.id as lookup_education__id,le.name as lookup_education__name,le.description as lookup_education__description,cap.id as common_company__id,cap.name as common_company__name,cap.email as common_company__email,cap.phone as common_company__phone,cap.fax as common_company__fax,cap.url as common_company__url,cap.logo_url as common_company__logo_url,cap.headquatersid as common_company__headquatersid,cap.secondaryaddressid as common_company__secondaryaddressid,cap.hmid as common_company__hmid,cap.hrcontactid as common_company__hrcontactid,cap.mgrcontactid as common_company__mgrcontactid,cap.secondarycontactid as common_company__secondarycontactid,cap.facebook as common_company__facebook,cap.linkedin as common_company__linkedin,cap.twitter as common_company__twitter,lc.id as lookup_city__id,lc.name as lookup_city__name,lc.latitude as lookup_city__latitude,lc.longitude as lookup_city__longitude,lc.region as lookup_city__region,lc.zipcode as lookup_city__zipcode,lc.countryid as lookup_city__countryid,cc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cc.*', this.deatailTableSQL);
}
CommonCandidateModel.prototype.modelType = 'mySql';
CommonCandidateModel.prototype.createCommonCandidate = function (candidateInfo, callback) {
    this.dbMySQL.query("insert into common_candidate SET ?", candidateInfo, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        candidateInfo.id = results.insertId;
        callback(err, candidateInfo);
    });
};
CommonCandidateModel.prototype.updateCommonCandidate = function (id, candidateInfo, callback) {
    this.dbMySQL.query('UPDATE common_candidate SET ? WHERE id = ' + id, candidateInfo, function (err) {
        callback(err, candidateInfo);
    });
};
CommonCandidateModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.contactid) {
        sql += ' and cco.id =  ' + params.filters.contactid;
    }
    if (params.filters.firstname) {
        sql += ' and cco.firstname like ' + "'" + params.filters.firstname.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += ' and cco.email like ' + "'" + params.filters.email.toLowerCase() + "'";
    }
    if (params.filters.phone) {
        sql += " and cco.phone = '" + params.filters.phone + "'";
    }
    if (params.filters.name) {
        sql += ' and cap.name like ' + "'" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.addressid) {
        sql += ' and ca.id = ' + params.filters.addressid;
    }
    if (params.filters.address1) {
        sql += ' and ca.address1 like ' + "'" + params.filters.address1.toLowerCase() + "'";
    }
    if (params.filters.region) {
        sql += ' and ca.region like ' + "'" + params.filters.region.toLowerCase() + "'";
    }
    if (params.filters.companyid) {
        sql += ' and cap.id = ' + params.filters.companyid;
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
CommonCandidateModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and cc.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(null, results[0]);
        }
    });
};
CommonCandidateModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.contact) {
        contact.update(data.contact.id, data.contact, function (err, contactData) {
            if (err) {
                return callback(err);
            }
            data.contactid = contactData.data.id;
            delete data.contact;
            self.createCommonCandidate(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createCommonCandidate(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
CommonCandidateModel.prototype.update = function (id, data, callback) {
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
                    self.updateCommonCandidate(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateCommonCandidate(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }
    });
};
CommonCandidateModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM common_candidate WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
CommonCandidateModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.firstname) {
        sql += " and lower(cco.firstname) like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  lower(cco.email) like '%" + params.email + "%'";
    }
    if (params.address1) {
        sql += " and  lower(ca.address1)  like '%" + params.address1 + "%'";
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
module.exports = CommonCandidateModel;