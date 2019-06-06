var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CommonAddressModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select ca.*,DATE_FORMAT(ca.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from common_address ca ,lookup_city lc where ca.cityid = lc.id';
    this.deatailTableSQL = "ca.id,ca.address1,ca.address2,lc.id as lookup_city__id,lc.name as lookup_city__name,lc.latitude as lookup_city__latitude,lc.longitude as lookup_city__longitude,lc.region as lookup_city__region,lc.zipcode as lookup_city__zipcode,lc.countryid as lookup_city__countryid,ca.usercity,ca.region, ca.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("ca.*", this.deatailTableSQL);
}
CommonAddressModel.prototype.modelType = 'mySql';
CommonAddressModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.address1) {
        sql += " and lower(ca.address1) like '" + params.filters.address1.toLowerCase() + "' ";
    }
    if (params.filters.region) {
        sql += " and lower(ca.region) like '" + params.filters.region.toLowerCase() + "' ";
    }
    if (params.filters.countryid) {
        sql += ' and lc.countryid = ' + params.filters.countryid;
    }
    if (params.filters.cityid) {
        sql += ' and lc.id = ' + params.filters.cityid;
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + "," + params.paging.limitend;
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
CommonAddressModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ca.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, function (err, result) {
                callback(err, result[0]);
            });
        } else {
            callback(err, results[0]);
        }
    });
};
CommonAddressModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO common_address SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CommonAddressModel.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            self.dbMySQL.query('UPDATE common_address SET ? WHERE id = ' + id, data, function (err) {
                callback(err, {data: data, type: 'update'});
            });
        } else {
            self.create(data, function (err) {
                callback(err, {data: data, type: 'create'});
            });
        }
    });
};
CommonAddressModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM common_address WHERE id = ' + id, callback);
};
CommonAddressModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.address1) {
        sql += " and ca.address1 like '%" + params.address1 + "%'";
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
module.exports = CommonAddressModel;
