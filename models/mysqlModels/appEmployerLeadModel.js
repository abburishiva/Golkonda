var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    CompanyModel = require('./commonCompanyModel'),
    commonCompany;
function AppEmployerLeadModel() {
    this.modelType = 'mySql';
    commonCompany = new CompanyModel();
    this.dbMySQL = connection;
    this.tableOnly = 'select ael.*,DATE_FORMAT(ael.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from  app_employer_lead ael ,common_company cc,common_address ca,common_address caa,common_contact cco,common_contact ccoo,common_contact ccco,common_contact ccooo,app_mgmt_employee ame,common_employee cem  where ael.companyid=cc.id and cc.headquatersid=ca.id and cc.secondaryaddressid=caa.id and cc.hrcontactid=cco.id and cc.hmid=ccoo.id and cc.secondarycontactid=ccco.id and cc.mgrcontactid=ccooo.id and ael.employeeid=ame.id and ame.employeeid=cem.id';
    this.deatailTableSQL = 'ael.id,ael.appcompanyid,cc.id as common_company__id,cc.name as common_company__name,cc.email as common_company__email,cc.phone as common_company__phone,cc.fax as  common_company__fax,cc.url as common_company__url,cc.logo_url as  common_company__logo_url,ca.id as common_company__headquaters__id,ca.address1 as common_company__headquaters__address1,ca.address2 as common_company__headquaters__address2,ca.cityid as common_company__headquaters__cityid,ca.usercity as common_company__headquaters__usercity,ca.region as common_company__headquaters__region,ca.countryid as common_company__headquaters__countryid,caa.id as common_company__secondaryaddress__id,caa.address1 as common_company__secondaryaddress__address1,caa.address2 as common_company__secondaryaddress__address2,ca.cityid as common_company__secondaryaddress__cityid,caa.usercity as common_company__secondaryaddress__usercity,caa.region as common_company__secondaryaddress__region,caa.countryid as common_company__secondaryaddress__countryid,cco.id as common_company__hrcontact__id,cco.firstname as common_company__hrcontact__firstname,cco.lastname as common_company__hrcontact__lastname,cco.middlename as common_company__hrcontact__middlename,cco.email as common_company__hrcontact__email,cco.phone as common_company__hrcontact__phone,cco.addressid as common_company__hrcontact__addressid,cco.secondaryemail as common_company__hrcontact__secondaryemail,cco.secondaryphone as common_company__hrcontact__secondaryphone,cco.workemail as common_company__hrcontact__workemail,cco.workphone as common_company__hrcontact__workphone,cco.ssn as common_company__hrcontact__ssn,cco.designation as common_company__hrcontact__designation,cco.dob as common_company__hrcontact__dob,cco.secondarycontactid as common_company__hrcontact__secondarycontactid,cco.sourcecontactid as common_company__hrcontact__sourcecontactid,cco.workaddressid as common_company__hrcontact__workaddressid,cco.entrydate as common_company__hrcontact__entrydate,cco.linkedin as common_company__hrcontact__linkedin,cco.skype as common_company__hrcontact__skype,cco.facebook as common_company__hrcontact__facebook,cco. twitter as common_company__hrcontact__twitter,ccoo.id as common_company__hiringmanager__id,ccoo.firstname as common_company__hiringmanager__firstname,ccoo.lastname as common_company__hiringmanager__lastname,ccoo.middlename as common_company__hiringmanager__middlename,ccoo.email as common_company__hiringmanager__email,ccoo.phone as common_company__hiringmanager__phone,ccoo.addressid as common_company__hiringmanager__addressid,ccoo.secondaryemail as common_company__hiringmanager__secondaryemail,ccoo.secondaryphone as common_company__hiringmanager__secondaryphone,ccoo.workemail as common_company__hiringmanager__workemail,ccoo.workphone as common_company__hiringmanager__workphone,ccoo.ssn as common_company__hiringmanager__ssn,ccoo.designation as common_company__hiringmanager__designation,ccoo.dob as common_company__hiringmanager__dob,ccoo.secondarycontactid as common_company__hiringmanager__secondarycontactid,ccoo.sourcecontactid as common_company__hiringmanager__sourcecontactid,ccoo.workaddressid as common_company__hiringmanager__workaddressid,ccoo.entrydate as common_company__hiringmanager__entrydate,ccoo.linkedin as common_company__hiringmanager__linkedin,ccoo.skype as common_company__hiringmanager__skype,ccoo.facebook as common_company__hiringmanager__facebook,ccoo. twitter as common_company__hiringmanager__twitter,ccco.id as common_company__secondarycontact__id,ccco.firstname as common_company__secondarycontact__firstname,ccco.lastname as common_company__secondarycontact__lastname,ccco.middlename as common_company__secondarycontact__middlename,ccco.email as common_company__secondarycontact__email,ccco.phone as common_company__secondarycontact__phone,ccco.addressid as common_company__secondarycontact__addressid,ccco.secondaryemail as common_company__secondarycontact__secondaryemail,ccco.secondaryphone as common_company__secondarycontact__secondaryphone,ccco.workemail as common_company__secondarycontact__workemail,ccco.workphone as common_company__secondarycontact__workphone,ccco.ssn as common_company__secondarycontact__ssn,ccco.designation as common_company__secondarycontact__designation,ccco.dob as common_company__secondarycontact__dob,ccco.secondarycontactid as common_company__secondarycontact__secondarycontactid,ccco.sourcecontactid as common_company__secondarycontact__sourcecontactid,ccco.workaddressid as common_company__secondarycontact__workaddressid,ccco.entrydate as common_company__secondarycontact__entrydate,ccco.linkedin as common_company__secondarycontact__linkedin,ccco.skype as common_company__secondarycontact__skype,ccco.facebook as common_company__secondarycontact__facebook,ccco. twitter as common_company__secondarycontact__twitter,ccooo.id as common_company__mgrcontact__id,ccooo.firstname as common_company__mgrcontact__firstname,ccooo.lastname as common_company__mgrcontact__lastname,ccooo.middlename as common_company__mgrcontact__middlename,ccooo.email as common_company__mgrcontact__email,ccooo.phone as common_company__mgrcontact__phone,ccooo.addressid as common_company__mgrcontact__addressid,ccooo.secondaryemail as common_company__mgrcontact__secondaryemail,ccooo.secondaryphone as common_company__mgrcontact__secondaryphone,ccooo.workemail as common_company__mgrcontact__workemail,ccooo.workphone as common_company__mgrcontact__workphone,ccooo.ssn as common_company__mgrcontact__ssn,ccooo.designation as common_company__mgrcontact__designation,ccooo.dob as common_company__mgrcontact__dob,ccooo.secondarycontactid as common_company__mgrcontact__secondarycontactid,ccooo.sourcecontactid as common_company__mgrcontact__sourcecontactid,ccooo.workaddressid as common_company__mgrcontact__workaddressid,ccooo.entrydate as common_company__mgrcontact__entrydate,ccooo.linkedin as common_company__mgrcontact__linkedin,ccooo.skype as common_company__mgrcontact__skype,ccooo.facebook as common_company__mgrcontact__facebook,ccooo. twitter as common_company__mgrcontact__twitter,cc.facebook as common_company__facebook,cc.linkedin as common_company__linkedin,cc.twitter as common_company__twitter,ael.levelid,ael.statusid,ame.id as app_mgmt_employee__id,cem.id as app_mgmt_employee__common_employee__id,cem.contactid as app_mgmt_employee__common_employee__contactid,cem.hiredate as app_mgmt_employee__common_employee__hiredate,cem.startdate as app_mgmt_employee__common_employee__startdate,ame.appcompanyid as app_mgmt_employee__appcompanyid,ame.statusid as app_mgmt_employee__statusid,ael.categoryid,ael.levelid,ael.notes,ael.statusid,ael.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ael.*', this.deatailTableSQL);
}
AppEmployerLeadModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.appcompanyid) {
        sql += ' and ael.appcompanyid = ' + params.filters.appcompanyid;
    }
    if (params.filters.companyid) {
        sql += ' and cc.id = ' + params.filters.companyid;
    }
    if (params.filters.name) {
        sql += " and cc.name like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += " and cc.email like '" + params.filters.email.toLowerCase() + "'";
    }
    if (params.filters.phone) {
        sql += " and cc.phone = '" + params.filters.phone + "'";
    }
    if (params.filters.employeeid) {
        sql += ' and cem.id =' + params.filters.employeeid;
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
AppEmployerLeadModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ael.id = ' + id;
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
AppEmployerLeadModel.prototype.createAppEmployerLead = function (data, callback) {
    this.dbMySQL.query('INSERT INTO app_employer_lead SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
AppEmployerLeadModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.company) {
        commonCompany.update(data.company.id, data.company, function (err) {
            if (err) {
                return callback(err);
            }
            data.companyid = data.company.id;
            delete data.company;
            self.createAppEmployerLead(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createAppEmployerLead(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
AppEmployerLeadModel.prototype.updateAppEmployerLead = function (id, empInfo, callback) {
    this.dbMySQL.query('UPDATE app_employer_lead SET ? WHERE id = ' + id, empInfo, function (err) {
        callback(err, empInfo);
    });
};
AppEmployerLeadModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.company) {
                commonCompany.update(data.company.id, data.company, function (err, companyData) {
                    if (err) {
                        return callback(err);
                    }
                    data.companyid = companyData.id;
                    delete data.company;
                    self.updateAppEmployerLead(id, data, function (err, result) {
                        if (err) {
                            return callback(err);
                        }
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateAppEmployerLead(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.createAppEmployerLead(data, function (err, result) {
                callback(err, result);
            });
        }
    });
};
AppEmployerLeadModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM app_employer_lead WHERE id = ' + id, callback);
};
AppEmployerLeadModel.prototype.search = function (params, callback) {
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
module.exports = AppEmployerLeadModel;



