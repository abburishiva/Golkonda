var async = require('async'),
    connection = require('../../utils/db/mysqlConnect'),
    CommonEmployeeModel = require('./commonEmployeeModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    commonEmployee;
function AppMgmtEmployeeModel() {
    this.modelType = 'mySql';
    commonEmployee = new CommonEmployeeModel();
    this.dbMySQL = connection;
    this.tableOnly = 'select ame.*,DATE_FORMAT(ame.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from app_mgmt_employee ame ,common_employee ce,common_contact cc where  ame.employeeid = ce.id and ce.contactid = cc.id';
    this.deatailTableSQL = 'ame.id,ce.id as common_employee__id,cc.id as common_employee__common_contact__id , cc.firstname as common_employee__common_contact__firstname, cc.lastname as common_employee__common_contact__lastname , cc.middlename as common_employee__common_contact__middlename , cc.email as common_employee__common_contact__email,cc.phone as common_employee__common_contact__phone,cc.addressid as common_employee__common_contact__addressid,cc.secondaryemail as common_employee__common_contact__secondaryemail, cc.secondaryphone as common_employee__common_contact__secondaryphone,cc.secondarycontactid as common_employee__common_contact__secondarycontactid , cc.sourcecontactid as common_employee__common_contact__sourcecontactid , cc.designation as common_employee__common_contact__designation, cc.workemail as common_employee__common_contact__workemail , cc.workphone as common_employee__common_contact__workphone, cc.workaddressid as common_employee__common_contact__workaddressid, DATE_FORMAT(cc.entrydate,"%m-%d-%Y %H:%i:%s") as common_employee__common_contact__entrydate , cc.dob as common_employee__common_contact__dob, cc.linkedin as common_employee__common_contact__linkedin , cc.skype as common_employee__common_contact__skype, cc.facebook as common_employee__common_contact__facebook,cc.twitter as common_employee__common_contact__twitter, DATE_FORMAT(ce.hiredate,"%m-%d-%Y %H:%i:%s") as common_employee__hiredate,DATE_FORMAT(ce.startdate,"%m-%d-%Y %H:%i:%s")  as common_employee__startdate,ame.appcompanyid,ame.statusid,ame.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ame.*', this.deatailTableSQL);
}
AppMgmtEmployeeModel.prototype.createAppMgmtEmployee = function (appMgmtEmployeeInfo, callback) {
    this.dbMySQL.query("insert into app_mgmt_employee SET ?", appMgmtEmployeeInfo, function (err, results) {
        if (results) {
            appMgmtEmployeeInfo.id = results.insertId;
        }
        callback(err, appMgmtEmployeeInfo);
    });
};
AppMgmtEmployeeModel.prototype.updateAppMgmtEmployee = function (id, appMgmtEmployeeInfo, callback) {
    this.dbMySQL.query('UPDATE app_mgmt_employee SET ? WHERE id = ' + id, appMgmtEmployeeInfo, function (err) {
        callback(err, appMgmtEmployeeInfo);
    });
};
AppMgmtEmployeeModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.employeeid) {
        sql += ' and ce.id =' + params.filters.employeeid;
    }
    if (params.filters.contactid) {
        sql += ' and cc.id =' + params.filters.contactid;
    }
    if (params.filters.addressid) {
        sql += ' and cc.addressid =' + params.filters.addressid;
    }
    if (params.filters.firstname) {
        sql += " and cc.firstname like '" + params.filters.firstname.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += " and cc.email like '" + params.filters.email.toLowerCase() + "'";
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
            jsonUtil.restructureJSONArray(results, function (err, result) {
                callback(err, result);
            });
        } else {
            callback(null, results);
        }
    });
};
AppMgmtEmployeeModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ame.id = ' + id;
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
AppMgmtEmployeeModel.prototype.create = function (data, callback) {
    var self = this;
    async.eachOf(data, function (item, key, itemCallbackFn) {
        if (key.indexOf('_employee') >= 0) {
            commonEmployee.update(item.id, item, function (err, employeeData) {
                if (err) {
                    itemCallbackFn();
                }
                if (key === 'common_employee') {
                    data.employeeid = employeeData.data.id;
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
        self.createAppMgmtEmployee(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    });
};
AppMgmtEmployeeModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            async.eachOf(data, function (item, key, itemCallbackFn) {
                if (key.indexOf('common_employee') >= 0) {
                    commonEmployee.update(item.id, item, function (err, employeeData) {
                        if (err) {
                            itemCallbackFn();
                        }
                        if (key === 'common_employee') {
                            data.employeeid = employeeData.data.id;
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
                self.updateAppMgmtEmployee(data, function (err, result) {
                    callback(err, {data: result, type: 'create'});
                });
            });
        } else {
            self.create(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        }
    });
};
AppMgmtEmployeeModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM app_mgmt_employee WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
AppMgmtEmployeeModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.firstname) {
        sql += " and  lower(cc.firstname) like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  lower(cc.email)  like '%" + params.email + "%'";
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
module.exports = AppMgmtEmployeeModel;

