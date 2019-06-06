var connection = require('../../utils/db/mysqlConnect'),
    ContactModel = require('./commonContactModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    contact;
function ContactFeedbackModel() {
    contact = new ContactModel();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cf.* ,DATE_FORMAT(cf.lastmodtime,"%m-%d-%Y %H:%i:%s") as lastmodtime from contact_feedback cf, common_contact cco,common_address ca where cf.contactid = cco.id and cco.addressid=ca.id';
    this.deatailTableSQL = 'cf.id,cf.feedbackidid,cco.id as common_contact__id,cco.firstname as common_contact__firstname,cco.lastname as common_contact__lastname,cco.middlename as common_contact__middlename,cco.email as common_contact__email,cco.phone as common_contact__phone,ca.id as common_contact__common_address__id,ca.address1 as common_contact__common_address__address1,ca.address2 as common_contact__common_address__address2,ca.cityid as common_contact__common_address__cityid,ca.usercity as common_contact__common_address__usercity,ca.region as common_contact__common_address__region,ca.countryid as common_contact__common_address__countryid,cco.secondaryemail as common_contact__secondaryemail,cco.secondaryphone as common_contact__secondaryphone,cco.workemail as common_contact__workemail,cco.workphone as common_contact__workphone,cco.designation as common_contact__designation,DATE_FORMAT(cco.dob,"%m-%d-%Y %H:%i:%s") as common_contact__dob,cco.secondarycontactid as common_contact__secondarycontactid,cco.sourcecontactid as common_contact__sourcecontactid,cco.entrydate as common_contact__entrydate,cco.workaddressid as  common_contact__workaddressid,cco.linkedin as common_contact__linkedin,cco.skype as common_contact__skype,cco.facebook as common_contact__facebook, cco.twitter as common_contact__twitter,cf.name,cf.email,cf.phone,cf.message,cf.improvemessage,cf.yelp,cf.google,cf.portal,cf.facebook,cf.twitter,cf.linkedin,cf.referflag,cf.useastestimonial,cf.feedbackflag';
    this.tableWithDependenciesSQL = this.tableOnly.replace('cf.*', this.deatailTableSQL);
}
ContactFeedbackModel.prototype.createContactFeedback = function (feedbackInfo, callback) {
    this.dbMySQL.query("insert into contact_feedback SET ?", feedbackInfo, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        feedbackInfo.id = results.insertId;
        callback(err, feedbackInfo);
    });
};
ContactFeedbackModel.prototype.updateContactFeedback = function (id, feedbackInfo, callback) {
    this.dbMySQL.query('UPDATE contact_feedback SET ? WHERE id = ' + id, feedbackInfo, function (err) {
        callback(err, feedbackInfo);
    });
};
ContactFeedbackModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.contactid) {
        sql += ' and cco.id =  ' + params.filters.contactid;
    }
    if (params.filters.firstname) {
        sql += ' and cco.firstname like ' + "'" + params.filters.firstname.toString().toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += ' and cco.email like ' + "'" + params.filters.email.toString().toLowerCase() + "'";
    }
    if (params.filters.phone) {
        sql += " and cco.phone = '" + params.filters.phone + "'";
    }
    if (params.filters.name) {
        sql += ' and cap.name like ' + "'" + params.filters.name.toString().toLowerCase() + "'";
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
ContactFeedbackModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and cf.id = ' + id;
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
ContactFeedbackModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.contact) {
        contact.update(data.contact.id, data.contact, function (err, contactData) {
            if (err) {
                return callback(err);
            }
            data.contactid = contactData.data.id;
            delete data.contact;
            self.createContactFeedback(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createContactFeedback(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
ContactFeedbackModel.prototype.update = function (id, data, callback) {
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
                    self.updateContactFeedback(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateContactFeedback(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }
    });
};
ContactFeedbackModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM contact_feedback WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
ContactFeedbackModel.prototype.search = function (params, callback) {
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
module.exports = ContactFeedbackModel;