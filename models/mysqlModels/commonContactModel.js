var connection = require('../../utils/db/mysqlConnect'),
    CommonAddressModel = require('../mysqlModels/commonAddressModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    am;
function CommonContactModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    am = new CommonAddressModel();
    this.tableOnly = 'select cc.*,DATE_FORMAT(cc.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmodedatetime from common_contact cc , common_address ca, lookup_city lc where cc.addressid = ca.id and ca.cityid=lc.id ';
    this.deatailTableSQL = "cc.id,cc.firstname , cc.lastname , cc.middlename , cc.email,cc.phone,cc.secondaryemail , cc.secondaryphone,cc.secondarycontactid , cc.sourcecontactid , cc.designation, cc.workemail , cc.workphone , cc.workaddressid, cc.entrydate, cc.dob , cc.linkedin , cc.skype , cc.facebook , cc.twitter,ca.id as common_address__id, ca.address1 as common_address__address1 , ca.address2 as common_address__address2,lc.id as common_address__lookup_city__id,lc.name as common_address__lookup_city__name , lc.latitude as common_address__lookup_city__latitude, lc.longitude as common_address__lookup_city__longitude, lc.region as common_address__lookup_city__region ,lc.countryid as common_address__lookup_city__countryid, cc.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("cc.*", this.deatailTableSQL);
}
CommonContactModel.prototype.modelType = 'mySql';
CommonContactModel.prototype.updateContact = function (id, contactInfo, callback) {
    this.dbMySQL.query('UPDATE common_contact SET ? WHERE id = ' + id, contactInfo, function (err) {
        callback(err, contactInfo);
    });
};
CommonContactModel.prototype.createContact = function (contactInfo, callback) {
    this.dbMySQL.query("insert into common_contact SET ?", contactInfo, function (err, result) {
        if (result) {
            contactInfo.id = result.insertId;
        }
        callback(err, contactInfo);
    });
};
CommonContactModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.firstname) {
        sql += " and lower(cc.firstname)  like " + "'" + params.filters.firstname.toLowerCase() + "'";
    }
    if (params.filters.lastname) {
        sql += " and lower(cc.lastname) like " + "'" + params.filters.lastname.toLowerCase() + "'";
    }
    if (params.filters.email) {
        sql += " and lower(cc.email) like " + "'" + params.filters.email.toLowerCase() + "'";
    }
    if (params.filters.workemail) {
        sql += " and lower(cc.workemail) like" + "'" + params.filters.workemail.toLowerCase() + "' ";
    }
    if (params.filters.addressid) {
        sql += " and lower(ca.id) = " + params.filters.addressid;
    }
    if (params.filters.address1) {
        sql += " and lower(ca.address1) like " + "'" + params.filters.address1.toLowerCase() + "'";
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
CommonContactModel.prototype.findOne = function (params, id, callback) {
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
CommonContactModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.address) {
        am.update(data.address.id, data.address, function (err, addressData) {
            if (err) {
                return callback(err);
            }
            data.addressid = addressData.data.id;
            delete data.address;
            self.createContact(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createContact(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
CommonContactModel.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.address) {
                am.update(data.address.id, data.address, function (err, addressData) {
                    if (err) {
                        return callback(err);
                    }
                    data.addressid = addressData.id;
                    delete data.address;
                    self.updateContact(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateContact(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, function (err, result) {
                callback(err, result);
            });
        }
    });
};
CommonContactModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM common_contact WHERE id = ' + id, function (err, result) {
        callback(err, result);
    });
};
CommonContactModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.address1) {
        sql += " and ca.address1 like '%" + params.address1 + "%'";
    }
    if (params.firstname) {
        sql += " and  lower(cc.firstname) like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  lower(cc.email) like '%" + params.email + "%'";
    }
    if (params.name) {
        sql += " and  lower(lc.name) like '%" + params.name + "%'";
    }
    if (params.region) {
        sql += " and  (lc.region)  like '%" + params.region + "%'";
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
module.exports = CommonContactModel;
