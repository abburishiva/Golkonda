var connection = require('../../utils/db/mysqlConnect'),
    ContactModel = require('./commonContactModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    cm;
function CommonEmployeeModel() {
    this.dbMySQL = connection;
    cm = new ContactModel();
    this.modelType = 'mySql';
    this.tableOnly = 'select ce.*,DATE_FORMAT(ce.hiredate,"%m-%d-%Y %H:%i:%s") as hiredate,DATE_FORMAT(ce.startdate,"%m-%d-%Y %H:%i:%s") as startdate,DATE_FORMAT(ce.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime  from common_employee ce ,common_contact cc,common_address ca,lookup_city lc,lookup_country lkc  where ce.contactid = cc.id and cc.addressid=ca.id and ca.cityid = lc.id and lc.countryid=lkc.id';
    this.deatailTableSQL = 'ce.id,cc.id as common_contact__id ,cc.firstname as common_contact__firstname, cc.lastname as common_contact__lastname , cc.middlename as common_contact__middlename , cc.email as common_contact__email,cc.phone as common_contact__phone,cc.secondaryemail as common_contact__secondaryemail, cc.secondaryphone as common_contact__secondaryphone,cc.secondarycontactid as common_contact__secondarycontactid , cc.sourcecontactid as common_contact__sourcecontactid , cc.designation as common_contact__designation, cc.workemail as common_contact__workemail , cc.workphone as common_contact__workphone, cc.workaddressid as common_contact__workaddressid,DATE_FORMAT(cc.entrydate,"%m-%d-%Y,%H:%i:%s") as common_contact__entrydate, DATE_FORMAT(cc.dob,"%m-%d-%Y,%H:%i:%s") as common_contact__dob, cc.linkedin as common_contact__linkedin , cc.skype as common_contact__skype, cc.facebook as common_contact__facebook, cc.twitter as common_contact__twitter ,ca.id as common_contact__common_address__id ,ca.address1 as common_contact__common_address__address1,ca.address2 as common_contact__common_address__address2,ca.cityid as common_contact__common_address__cityid,ca.usercity as common_contact__common_address__usercity,ca.region as common_contact__common_address__region,ca.countryid as common_contact__common_address__countryid,lc.id as common_contact__common_address__lookup_city__id ,lc.name as common_contact__common_address__lookup_city__name , lc.latitude as common_contact__common_address__lookup_city__latitude, lc.longitude as common_contact__common_address__lookup_city__longitude, lc.region as common_contact__common_address__lookup_city__region , lkc.iso3 as common_contact__common_address__lookup_city__lookup_country__is03, lkc.iso2 as common_contact__common_address__lookup_city__lookup_country__iso2, lkc.short_name as common_contact__common_address__lookup_city__lookup_country__short_name, lkc.long_name as common_contact__common_address__lookup_city__lookup_country__long_name , ce.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("ce.*", this.deatailTableSQL);
}
CommonEmployeeModel.prototype.createCommonEmployee = function (commonEmployeeInfo, callback) {
    this.dbMySQL.query("insert into common_employee SET ?", commonEmployeeInfo, function (err, results) {
        if (results) {
            commonEmployeeInfo.id = results.insertId;
        }
        callback(err, commonEmployeeInfo);
    });
};
CommonEmployeeModel.prototype.updateCommonEmployee = function (id, commonEmployeeInfo, callback) {
    this.dbMySQL.query('UPDATE common_employee SET ? WHERE id = ' + id, commonEmployeeInfo, function (err) {
        callback(err, commonEmployeeInfo);
    });
};
CommonEmployeeModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.firstname) {
        sql += " and lower(cc.firstname)  like '" + params.filters.firstname.toString().toLowerCase() + "' ";
    }
    if (params.filters.lastname) {
        sql += " and lower(cc.lastname) like '" + params.filters.lastname.toString().toLowerCase() + "' ";
    }
    if (params.filters.address1) {
        sql += " and lower(ca.address1) like '" + params.filters.address1.toString().toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += " and lower(cc.email) like '" + params.filters.email.toString().toLowerCase() + "' ";
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
CommonEmployeeModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;

    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ce.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err, null);
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
CommonEmployeeModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.contact) {
        cm.update(data.contact.id, data.contact, function (err, contactData) {
            if (err) {
                return callback(err);
            }
            data.contactid = contactData.data.id;
            delete data.contact;
            self.createCommonEmployee(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createCommonEmployee(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
CommonEmployeeModel.prototype.update = function (id, data, callback) {
    var commonEmployeeModel = this, params = {};
    commonEmployeeModel.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.contact) {
                cm.update(data.contact.id, data.contact, function (err) {
                    var employeeInfo;
                    if (err) {
                        return callback(err);
                    }
                    if (data.employee) {
                        employeeInfo = data.employee;
                    } else {
                        delete data.contact;
                        employeeInfo = data;
                    }
                    commonEmployeeModel.updateCommonEmployee(id, employeeInfo, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                var commonEmployeeData;
                if (data.employee) {
                    commonEmployeeData = data.employee;
                } else {
                    delete data.contact;
                    commonEmployeeData = data;
                }
                commonEmployeeModel.updateCommonEmployee(id, commonEmployeeData, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            commonEmployeeModel.create(data, callback);
        }
    });
};
CommonEmployeeModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM common_employee WHERE id = ' + id, callback);
};
CommonEmployeeModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.firstname) {
        sql += " and lower(cc.firstname) like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  lower(cc.email) like '%" + params.email + "%'";
    }
    if (params.address1) {
        sql += " and  lower(ca.address1)  like '%" + params.address1 + "%'";
    }
    if (params.name) {
        sql += " and  lower(lc.name)  like '%" + params.name + "%'";
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
module.exports = CommonEmployeeModel;
