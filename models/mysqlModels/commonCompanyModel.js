var async = require('async'),
    connection = require('../../utils/db/mysqlConnect'),
    AddressModel = require('./commonAddressModel'),
    ContactModel = require('./commonContactModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    am,
    cc;
function CommonCompanyModel() {
    am = new AddressModel();
    cc = new ContactModel();
    this.modelType = 'mySql';
    this.dbMySQL = connection;
    this.tableOnly = 'select cc.*,DATE_FORMAT(cc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from common_company cc,common_address ca,common_address caa,common_contact cco,common_contact ccoo,common_contact ccco,common_contact ccooo where cc.headquatersid=ca.id and cc.secondaryaddressid=caa.id and cc.hrcontactid=cco.id and cc.hmid=ccoo.id and cc.secondarycontactid=ccco.id and cc.mgrcontactid=ccooo.id';
    this.deatailTableSQL = 'cc.id,cc.name,cc.email,cc.phone,cc.fax,cc.url,cc.logo_url,ca.id as headquaters__id,ca.address1 as headquaters__address1,ca.address2 as headquaters__address2,ca.cityid as headquaters__cityid,ca.usercity as headquaters__usercity,ca.region as headquaters__region,ca.countryid as headquaters__countryid,caa.id as secondaryaddress__id,caa.address1 as secondaryaddress__address1,caa.address2 as secondaryaddress__address2,ca.cityid as secondaryaddress__cityid,caa.usercity as secondaryaddress__usercity,caa.region as secondaryaddress__region,caa.countryid as secondaryaddress__countryid,cco.id as hrcontact__id,cco.firstname as hrcontact__firstname,cco.lastname as hrcontact__lastname,cco.middlename as hrcontact__middlename,cco.email as hrcontact__email,cco.phone as hrcontact__phone,cco.addressid as hrcontact__addressid,cco.secondaryemail as hrcontact__secondaryemail,cco.secondaryphone as hrcontact__secondaryphone,cco.workemail as hrcontact__workemail,cco.workphone as hrcontact__workphone,cco.ssn as hrcontact__ssn,cco.designation as hrcontact__designation,cco.dob as hrcontact__dob,cco.secondarycontactid as hrcontact__secondarycontactid,cco.sourcecontactid as hrcontact__sourcecontactid,cco.workaddressid as hrcontact__workaddressid,cco.entrydate as hrcontact__entrydate,cco.linkedin as hrcontact__linkedin,cco.skype as hrcontact__skype,cco.facebook as hrcontact__facebook,cco. twitter as hrcontact__twitter,ccoo.id as hiringmanager__id,ccoo.firstname as hiringmanager__firstname,ccoo.lastname as hiringmanager__lastname,ccoo.middlename as hiringmanager__middlename,ccoo.email as hiringmanager__email,ccoo.phone as hiringmanager__phone,ccoo.addressid as hiringmanager__addressid,ccoo.secondaryemail as hiringmanager__secondaryemail,ccoo.secondaryphone as hiringmanager__secondaryphone,ccoo.workemail as hiringmanager__workemail,ccoo.workphone as hiringmanager__workphone,ccoo.ssn as hiringmanager__ssn,ccoo.designation as hiringmanager__designation,ccoo.dob as hiringmanager__dob,ccoo.secondarycontactid as hiringmanager__secondarycontactid,ccoo.sourcecontactid as hiringmanager__sourcecontactid,ccoo.workaddressid as hiringmanager__workaddressid,ccoo.entrydate as hiringmanager__entrydate,ccoo.linkedin as hiringmanager__linkedin,ccoo.skype as hiringmanager__skype,ccoo.facebook as hiringmanager__facebook,ccoo. twitter as hiringmanager__twitter,ccco.id as secondarycontact__id,ccco.firstname as secondarycontact__firstname,ccco.lastname as secondarycontact__lastname,ccco.middlename as secondarycontact__middlename,ccco.email as secondarycontact__email,ccco.phone as secondarycontact__phone,ccco.addressid as secondarycontact__addressid,ccco.secondaryemail as secondarycontact__secondaryemail,ccco.secondaryphone as secondarycontact__secondaryphone,ccco.workemail as secondarycontact__workemail,ccco.workphone as secondarycontact__workphone,ccco.ssn as secondarycontact__ssn,ccco.designation as secondarycontact__designation,ccco.dob as secondarycontact__dob,ccco.secondarycontactid as secondarycontact__secondarycontactid,ccco.sourcecontactid as secondarycontact__sourcecontactid,ccco.workaddressid as secondarycontact__workaddressid,ccco.entrydate as secondarycontact__entrydate,ccco.linkedin as secondarycontact__linkedin,ccco.skype as secondarycontact__skype,ccco.facebook as secondarycontact__facebook,ccco. twitter as secondarycontact__twitter,ccooo.id as mgrcontact__id,ccooo.firstname as mgrcontact__firstname,ccooo.lastname as mgrcontact__lastname,ccooo.middlename as mgrcontact__middlename,ccooo.email as mgrcontact__email,ccooo.phone as mgrcontact__phone,ccooo.addressid as mgrcontact__addressid,ccooo.secondaryemail as mgrcontact__secondaryemail,ccooo.secondaryphone as mgrcontact__secondaryphone,ccooo.workemail as mgrcontact__workemail,ccooo.workphone as mgrcontact__workphone,ccooo.ssn as mgrcontact__ssn,ccooo.designation as mgrcontact__designation,ccooo.dob as mgrcontact__dob,ccooo.secondarycontactid as mgrcontact__secondarycontactid,ccooo.sourcecontactid as mgrcontact__sourcecontactid,ccooo.workaddressid as mgrcontact__workaddressid,ccooo.entrydate as mgrcontact__entrydate,ccooo.linkedin as mgrcontact__linkedin,ccooo.skype as mgrcontact__skype,ccooo.facebook as mgrcontact__facebook,ccooo. twitter as mgrcontact__twitter,cc.facebook,cc.linkedin,cc.twitter';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cc.*", this.deatailTableSQL);
}
CommonCompanyModel.prototype.updateCommonCompany = function (id, commoncompanyInfo, callback) {
    this.dbMySQL.query('UPDATE common_company SET ? WHERE id = ' + id, commoncompanyInfo, function (err) {
        callback(err, commoncompanyInfo);
    });
};
CommonCompanyModel.prototype.createCommonCompany = function (commoncompanyInfo, callback) {
    this.dbMySQL.query("insert into common_company SET ?", commoncompanyInfo, function (err, results) {
        if (results) {
            commoncompanyInfo.id = results.insertId;
        }
        callback(err, commoncompanyInfo);
    });
};
CommonCompanyModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(cc.name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += " and lower(cc.email)like '" + params.filters.email.toLowerCase() + "' ";
    }
    if (params.filters.phone) {
        sql += " and cc.phone = '" + params.filters.phone + "'";
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
CommonCompanyModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cc.id = ' + id;
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
CommonCompanyModel.prototype.create = function (data, callback) {
    var self = this;
    async.eachOf(data, function (item, key, itemCallbackFn) {
        if (key.indexOf('_contact') >= 0) {
            cc.update(item.id, item, function (err, contactData) {
                if (err) {
                    itemCallbackFn();
                }
                if (key === 'hr_contact') {
                    data.hrcontactid = contactData.data.id;
                }
                if (key === 'secondary_contact') {
                    data.secondarycontactid = contactData.data.id;
                }
                if (key === 'mgr_contact') {
                    data.mgrcontactid = contactData.data.id;
                }
                delete data[key];
                itemCallbackFn();
            });
        } else if (key.indexOf('_address') >= 0) {
            am.update(item.id, item, function (err, addressData) {
                if (err) {
                    itemCallbackFn();
                }
                if (key === 'secondary_address') {
                    data.secondaryaddressid = addressData.data.id;
                }
                if (key === 'headquaters_address') {
                    data.headquatersid = addressData.data.id;
                }
                delete data[key];
                itemCallbackFn();
            });
        } else {

            itemCallbackFn();

        }
    }, function (err) {
        if (err) {
            return callback(err);
        }
        self.createCommonCompany(data, function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(err, {data: result, type: 'create'});
        });
    });
};
CommonCompanyModel.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            async.eachOf(data, function (item, key, itemCallbackFn) {
                if (key.indexOf('_contact') >= 0) {
                    cc.update(item.id, item, function (err, contactData) {
                        if (err) {
                            itemCallbackFn();
                        }
                        if (key === 'hr_contact') {
                            data.hrcontactid = contactData.data.id;
                        }
                        if (key === 'secondary_contact') {
                            data.secondarycontactid = contactData.data.id;
                        }
                        if (key === 'mgr_contact') {
                            data.mgrcontactid = contactData.data.id;
                        }
                        delete data[key];
                        itemCallbackFn();
                    });
                } else if (key.indexOf('_address') >= 0) {
                    am.update(item.id, item, function (err, addressData) {
                        if (err) {
                            itemCallbackFn();
                        }
                        if (key === 'secondary_address') {
                            data.secondaryaddressid = addressData.data.id;
                        }
                        if (key === 'headquaters_address') {
                            data.headquatersid = addressData.data.id;
                        }
                        delete data[key];
                        itemCallbackFn();
                    });
                } else {
                    itemCallbackFn();
                }

            }, function (err) {
                if (err) {
                    return callback(err);
                }
                self.updateCommonCompany(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            });

        } else {
            self.create(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        }
    });
};
CommonCompanyModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM common_company WHERE id = ' + id, callback);
};
CommonCompanyModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(cc.name) like '%" + params.name + "%'";
    }
    if (params.email) {
        sql += " and  lower(cc.email)  like '%" + params.email + "%'";
    }
    if (params.phone) {
        sql += " and  lower(cc.phone)  like '%" + params.phone + "%'";
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
module.exports = CommonCompanyModel;

