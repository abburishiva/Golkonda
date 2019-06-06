var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    log;
function LookupCountryModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select lkc.*, lkc.short_name as name,DATE_FORMAT(lkc.lastmoddatetime,"%b %d %Y %h:%i %p") as lastmoddatetime from lookup_country lkc where 1=1';
    log = new Logger();
    log.info("This is LookupCountryModel Constructor...");
}
LookupCountryModel.prototype.find = function (params, callback) {
    log.info("this is LookupCountryModel find function:");
    var sql = this.tableOnly;
    if (params.filters.name) {
        sql += " and lower(lkc.short_name) like '" + params.filters.name.toLowerCase() + "' ";
    }
    if (params.filters.iso3) {
        sql += " and lower(lkc.iso3) like '" + params.filters.iso3.toLowerCase() + "' ";
    }
    if (params.filters.iso2) {
        sql += " and lower(lkc.iso2) like '" + params.filters.iso2.toLowerCase() + "' ";
    }
    if (params && params.sorting && params.sorting.sort && params.filters && !params.filters.order) {
        sql += " order by " + params.sorting.sort;
    } else if (params && params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " DESC ";
    } else if (params && params.filters && params.filters.order.toLowerCase() === 'asc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " ASC ";
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    log.info('info at LookupCountryModel find method and the sql query');
    this.dbMySQL.query(sql, callback);
};
LookupCountryModel.prototype.findOne = function (params, id, callback) {
    log.info("this is LookupCountryModel findOne function:-");
    this.dbMySQL.query(this.tableOnly + ' AND lkc.id = ' + id, function (err, result) {
        log.info('info at LookupCountryModel findOne method and result');
        callback(err, result[0]);
    });
};
LookupCountryModel.prototype.create = function (data, callback) {
    log.info('info at LookupCountryModel create method and the creating data');
    if (data.name) {
        data.short_name = data.name;
        delete data.name;
    }
    log.info('info at LookupCountryModel and the finally creating data');
    this.dbMySQL.query('INSERT INTO lookup_country SET ?', data, function (err, result) {
        log.info('info at LookupCountryModel and the created result');
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
LookupCountryModel.prototype.updateCountry = function (id, countryInfo, callback) {
    log.info('info at updateCountry method in LookupCountryModel and update data');
    this.dbMySQL.query('UPDATE lookup_country SET ? WHERE id = ' + id, countryInfo, function (err) {
        callback(err, countryInfo);
    });
};
LookupCountryModel.prototype.update = function (id, data, callback) {
    log.info('info at update method and the updated data');
    var self = this, params = {};
    if (data.name) {
        delete data.short_name;
        data.short_name = data.name;
        delete data.name;
    }
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        log.info('info at findOne method in update function of LookupCountryModel and result');
        if (result) {
            self.updateCountry(id, data, function (err, result) {
                if (result.short_name) {
                    data.name = data.short_name;
                    delete data.short_name;
                }
                callback(err, result);
            });
        } else {
            log.info('info at create method in update function and created the data');
            self.create(data, function (err, result) {
                log.info('info at created the data and the result');
                callback(err, {data: result, type: 'create'});
            });
        }
    });
};
LookupCountryModel.prototype.remove = function (id, callback) {
    log.info('info at LookupCountryModel remove method and the remove id ');
    this.dbMySQL.query('DELETE FROM lookup_country WHERE id = ' + id, callback);
};
LookupCountryModel.prototype.search = function (params, callback) {
    log.info('info at LookupCountryModel search method and the params');
    this.dbMySQL.query("SELECT * FROM lookup_country  where short_name like '%" + params.short_name + "%' or long_name like '%" + params.long_name + "%'", callback);
};
module.exports = LookupCountryModel;
