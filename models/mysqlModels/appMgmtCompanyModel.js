var connection = require('../../utils/db/mysqlConnect'),
    CommonCompanyModel = require('./commonCompanyModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    cm;
function AppMgmtCompanyModel() {
    this.modelType = 'mySql';
    cm = new CommonCompanyModel();
    this.dbMySQL = connection;
    this.tableOnly = 'select amc.*,DATE_FORMAT(amc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from app_mgmt_company amc,common_company cc where  amc.companyid = cc.id';
    this.deatailTableSQL = 'amc.id,amc.alias,cc.id as common_company__id,cc.name as common_company__name,cc.email as common_company__email,cc.phone as common_company__phone,cc.fax as common_company__fax,cc.url as common_company__url,cc.logo_url as common_company__logo_url,cc.headquatersid as common_company__headquatersid,cc.secondaryaddressid as common_company__secondaryaddressid,cc.hrcontactid as common_company__hrcontactid,cc.mgrcontactid as common_company__mgrcontactid,cc.secondarycontactid as common_company__secondarycontactid,cc.facebook as common_company__facebook,cc.linkedin as common_company__linkedin,cc.twitter as common_company__twitter,amc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('amc.*', this.deatailTableSQL);
}
AppMgmtCompanyModel.prototype.createAppMgmtCompany = function (appMgmtCompanyInfo, callback) {
    var self = this;
    self.dbMySQL.query("insert into app_mgmt_company SET ?", appMgmtCompanyInfo, function (err, results) {
        if (results) {
            appMgmtCompanyInfo.id = results.insertId;
        }
        callback(err, appMgmtCompanyInfo);
    });
};
AppMgmtCompanyModel.prototype.updateAppMgmtCompany = function (id, appMgmtCompanyInfo, callback) {
    this.dbMySQL.query('UPDATE app_mgmt_company SET ? WHERE id = ' + id, appMgmtCompanyInfo, function (err) {
        callback(err, appMgmtCompanyInfo);
    });
};
AppMgmtCompanyModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " AND lower(cc.name) like '" + params.filters.name.toString().toLowerCase() + "' ";
    }
    if (params.filters.companyid) {
        sql += ' and cc.id = ' + params.filters.companyid;
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
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
AppMgmtCompanyModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and amc.id = ' + id;
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
AppMgmtCompanyModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.company) {
        cm.update(data.company.id, data.company, function (err, companyData) {
            if (err) {
                return callback(err);
            }
            data.companyid = companyData.data.data.id;
            delete data.company;
            self.createAppMgmtCompany(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createAppMgmtCompany(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
AppMgmtCompanyModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.company) {
                cm.update(data.company.id, data.company, function (err, companyData) {
                    if (err) {
                        return callback(err);
                    }
                    data.companyid = companyData.data.id;
                    delete data.company;
                    self.updateAppMgmtCompany(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateAppMgmtCompany(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }

    });
};
AppMgmtCompanyModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM app_mgmt_company WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
AppMgmtCompanyModel.prototype.search = function (params, callback) {
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
    if (params.alias) {
        sql += " and  lower(amc.alias)  like '%" + params.alias + "%'";
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
module.exports = AppMgmtCompanyModel;

