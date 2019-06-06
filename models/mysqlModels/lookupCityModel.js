var connection = require('../../utils/db/mysqlConnect'),
    CountryModel = require('./lookupCountryModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    country,
    log;
function LookupCityModel() {
    this.modelType = 'mySql';
    this.dbMySQL = connection;
    country = new CountryModel();
    this.tableOnly = 'SELECT lc.*,DATE_FORMAT(lc.lastmoddatetime,"%b %d %Y %h:%i %p") as lastmoddatetime FROM lookup_city lc,lookup_country lcn  where lc.countryid=lcn.id';
    this.deatailTableSQL = 'lc.id,lc.name,lc.latitude,lc.longitude,lc.region,lc.zipcode,lcn.id as lookup_country__id, lcn.iso2 as lookup_country__iso2,lcn.short_name as lookup_country__name,lcn.long_name as lookup_country__long_name,lcn.iso3 as lookup_country__iso3,lcn.numcode as lookup_country__numcode,lcn.un_member as lookup_country__un_member,lcn.calling_code as lookup_country__calling_code,lcn.cctld as lookup_country__cctld,lc.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('lc.*', this.deatailTableSQL);
    log = new Logger();
    log.info("This is LookupCityModel Constructor...");
}
LookupCityModel.prototype.createLookupCity = function (cityInfo, callback) {
    log.info('info at createLookupCity method and the data ');
    this.dbMySQL.query("insert into lookup_city SET ?", cityInfo, function (err, results) {
        log.info('info at created the request data and the result ');
        if (results) {
            cityInfo.id = results.insertId;
        }
        callback(err, cityInfo);
    });
};
LookupCityModel.prototype.updateLookupCity = function (id, cityInfo, callback) {
    log.info('info at updateLookupCity method and the data ');
    this.dbMySQL.query('UPDATE lookup_city SET ? WHERE id = ' + id, cityInfo, function (err, result) {
        callback(err, cityInfo);
    });
};
LookupCityModel.prototype.find = function (params, callback) {
    log.info("this is LookupCityModel find function:" + params);
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
        log.info("params.type:-" );
    }
    if (params.filters.name) {
        sql += " and lower(lc.name) like '" + params.filters.name.toLowerCase() + "' ";
        log.info("params.filters.name:-");
    }
    if (params.filters.region) {
        sql += " and lower(lc.region) like '" + params.filters.region.toLowerCase() + "' ";
        log.info("params.filters.region:-");
    }
    if (params.filters.latitude) {
        sql += " and lower(lc.latitude) like '" + params.filters.latitude.toLowerCase() + "' ";
        log.info("params.filters.latitude:-");
    }
    if (params.filters.longitude) {
        sql += " and lower(lc.longitude) like '" + params.filters.longitude + "' ";
        log.info("params.filters.longitude:-");
    }
    if (params.filters.zipcode) {
        sql += " and lc.zipcode ='" + params.filters.zipcode + "' ";
        log.info("params.filters.zipcode:-" );
    }
    if (params.filters.countryid) {
        sql += " and lc.countryid = '" + params.filters.countryid + "' ";
        log.info("params.filters.countryid:-");
    }
    if (params && params.sorting && params.sorting.sort && params.filters && !params.filters.order) {
        sql = sql + " order by " + params.sorting.sort;
        log.info("params.filters.sort:-");
    }
    else if (params && params.filters.order.toLowerCase() === 'desc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " DESC ";
    } else if (params && params.filters && params.filters.order.toLowerCase() === 'asc' && params.sorting && params.sorting.sort) {
        sql += " order by " + params.sorting.sort + " ASC ";
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
        log.info("params.paging.limitstart&&params.paging.limitend:-");
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
        log.info("params.paging.limitend:-");
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info("this.dbMySQL.query:-");
        if (err) {
            log.error(err);
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            log.info("params.type && params.type.toLowerCase() === 'all':-");
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            log.error(err);
            callback(err, results);
        }
    });
};
LookupCityModel.prototype.findOne = function (params, id, callback) {
    log.info("this is LookupCityModel findOne function:-");
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
        log.info("this.tableWithDependenciesSQL:-");
    }
    sql += ' and lc.id = ' + id;
    log.info("get by id:-" + sql);
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            log.info("finalResult:-");
            callback(err, finalResult);
        } else {
            log.error(err);
            callback(err, results[0]);
        }
    });
};
LookupCityModel.prototype.create = function (cityInfo, callback) {
    log.info("Info at LookupCityModel create function and the request data is:-");
    var self = this;
    if (cityInfo.lookup_country) {
        country.update(cityInfo.lookup_country.id, cityInfo.lookup_country, function (err, countryData) {
            cityInfo.countryid = countryData.data.id;
            delete cityInfo.lookup_country;
            self.createLookupCity(cityInfo, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createLookupCity(cityInfo, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
LookupCityModel.prototype.update = function (id, data, callback) {
    log.info('info at LookupCityModel update method and the updated params ');
    var self = this;
    self.findOne({}, id, function (err, result) {
        log.info('info at findOne method in update function and the result');
        if (result) {
            if (data.lookup_country) {
                country.update(data.lookup_country.id, data.lookup_country, function (err, countryData) {
                    data.countryid = countryData.data.id;
                    delete data.lookup_country;
                    self.updateLookupCity(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateLookupCity(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            log.info('info at create method in update function and the data ');
            self.create(data, callback);
        }
    });
};
LookupCityModel.prototype.remove = function (id, callback) {
    log.info("this is LookupCityModel remove function and the remove id ");
    this.dbMySQL.query('DELETE FROM lookup_city WHERE id = ' + id, callback);
};
LookupCityModel.prototype.search = function (params, callback) {
    log.info("this is LookupCityModel search function" + params);
    this.dbMySQL.query("SELECT * FROM lookup_city  where name like '%" + params.name + "%' or region like '%" + params.region + "%'", callback);
};
module.exports = LookupCityModel;

