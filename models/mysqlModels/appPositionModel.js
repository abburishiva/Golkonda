var connection = require('../../utils/db/mysqlConnect'),
    CompanyModel = require('./commonCompanyModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    company;
function AppPositionModel() {
    this.modelType = 'mySql';
    company = new CompanyModel();
    this.dbMySQL = connection;
    this.tableOnly = "select ap.*,DATE_FORMAT(ap.lastmoddatetime,'%m-%d-%Y %H:%i:%s') as lastmoddatetime from app_position ap LEFT JOIN common_company cc ON ap.companyid = cc.id";
    this.deatailTableSQL = "ap.id,ap.jobs_positionid,cc.name as common_company__name,cc.email as common_company__email,cc.phone as common_company__phone,cc.fax as common_company__fax,cc.url as common_company__url,cc.logo_url as  common_company__logo_url,cc.headquatersid as common_company__headquatersid,cc.secondaryaddressid as  common_company__secondaryaddressid,cc.hrcontactid as common_company__hrcontactid,cc.mgrcontactid as common_company__mgrcontactid,cc.secondarycontactid as common_company__secondarycontactid,cc.facebook as common_company__facebook,cc.linkedin as common_company__facebook,cc.twitter as common_company__twitter,ap.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("ap.*", this.deatailTableSQL);
}
AppPositionModel.prototype.createAppPosition = function (appPositionInfo, callback) {
    this.dbMySQL.query("insert into app_position SET ?", appPositionInfo, function (err, results) {
        if (results) {
            appPositionInfo.id = results.insertId;
        }
        callback(err, appPositionInfo);
    });
};
AppPositionModel.prototype.updateAppPosition = function (id, appPositionInfo, callback) {
    this.dbMySQL.query('UPDATE app_position SET ? WHERE id = ' + id, appPositionInfo, function (err) {
        callback(err, appPositionInfo);
    });
};
AppPositionModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.jobs_positionid) {
        sql += ' and ap.jobs_positionid = ' + params.filters.jobs_positionid;
    }
    if (params.filters.companyid) {
        sql += ' and ap.companyid = ' + params.filters.companyid;
    }
    if (params.filters.name) {
        sql += " and cc.name like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.companyid) {
        sql += ' and cc.id = ' + params.filters.companyid;
    }
    if (params.filters.email) {
        sql += " and cc.email like '" + params.filters.email.toLowerCase() + "'";
    }
    if (params.filters.phone) {
        sql += ' and cc.phone = ' + params.filters.phone;
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    }
    if (params.paging.limitend) {
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
AppPositionModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' where ap.id = ' + id;
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
AppPositionModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.company) {
        company.update(data.company.id, data.company, function (err, companyData) {
            if (err) {
                return callback(err);
            }
            data.companyid = companyData.data.id;
            delete data.company;
            self.createAppPosition(data, function (err, result) {
                callback(err, {data: result, type: 'create'});

            });
        });
    } else {
        self.createAppPosition(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
AppPositionModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.company) {
                company.update(data.company.id, data.company, function (err, companyData) {
                    if (err) {
                        return callback(err);
                    }
                    data.companyid = companyData.data.id;
                    self.updateAppPosition(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateAppPosition(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }
    });
};
AppPositionModel.prototype.remove = function (id, callback) {
    var sql = 'DELETE FROM app_position WHERE id = ' + id;
    this.dbMySQL.query(sql, callback);
};
AppPositionModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.address1) {
        sql += " and ca.address1 like '%" + params.address1 + "%'";
    }
    if (params.firstname) {
        sql += " and lower(cco.firstname) like '%" + params.firstname + "%'";
    }
    if (params.name) {
        sql += " and  lower(cc.name) like '%" + params.name + "%'";
    }
    if (params.email) {
        sql += " and  lower(cco.email)  like '%" + params.email + "%'";
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
module.exports = AppPositionModel;


