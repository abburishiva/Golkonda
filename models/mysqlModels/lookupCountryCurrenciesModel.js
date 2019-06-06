var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    log;

function LookupCountryCurrenciesModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cc.id,short_name as country,symbol,name,UPPER(code) as code,lastmoddatetime,lastmoduserid from (select lcc.salaryunit_id,lc.short_name,lcc.id,lcc.code from lookup_country lc inner join lookup_country_currencies lcc on lc.id = lcc.country_id) as cc inner join lookup_salary_units les';
    log = new Logger();
    log.info("This is LookupCountryCurrenciesModel Constructor...");
}

LookupCountryCurrenciesModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.country && !params.filters.name && !params.filters.q && !params.filters.code) {
        sql += " on short_name like'" + params.filters.country.toLowerCase() + "'";
    } else if (params.filters.country && params.filters.q && !params.filters.name && !params.filters.code) {
        sql += " on short_name like '" + params.filters.country.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')"
    }
    if (params.filters.name && !params.filters.country && !params.filters.q && !params.filters.code) {
        sql += " on name like'" + params.filters.name.toLowerCase() + "'";
    } else if (params.filters.name && params.filters.country && !params.filters.q && !params.filters.code) {
        sql += " on name like '" + params.filters.name.toLowerCase() + "' And short_name like '" + params.filters.country.toLowerCase() + "'";
    } else if (params.filters.name && params.filters.q && params.filters.country && !params.filters.code) {
        sql += " on name like '" + params.filters.name.toLowerCase() + "' And short_name like '" + params.filters.country.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')";
    } else if (params.filters.name && params.filters.q && !params.filters.country && !params.filters.code) {
        sql += " on name like '" + params.filters.name.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')"
    }
    if (params.filters.code && !params.filters.country && !params.filters.q && !params.filters.name) {
        sql += " on code like'" + params.filters.code.toLowerCase() + "'";
    } else if (params.filters.code && params.filters.name && params.filters.country && params.filters.q) {
        sql += " on name like '" + params.filters.name.toLowerCase() + "' And short_name like '" + params.filters.country.toLowerCase() + "' And code like '" + params.filters.code.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')";
    } else if (params.filters.code && params.filters.name && params.filters.q && !params.filters.country) {
        sql += " on name like '" + params.filters.name.toLowerCase() + "' And code like '" + params.filters.code.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')";
    } else if (params.filters.code && params.filters.country && params.filters.q && !params.filters.name) {
        sql += " on short_name like '" + params.filters.country.toLowerCase() + "' And code like '" + params.filters.code.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')";
    } else if (params.filters.code && params.filters.country && params.filters.name && !params.filters.q) {
        sql += " on short_name like '" + params.filters.country.toLowerCase() + "' And code like '" + params.filters.code.toLowerCase() + "' and name like '" + params.filters.name.toLowerCase() + "'";
    } else if (params.filters.code && params.filters.country && !params.filters.q && !params.filters.name) {
        sql += " on code like '" + params.filters.code.toLowerCase() + "' And short_name like '" + params.filters.country.toLowerCase() + "'";
    } else if (params.filters.code && params.filters.q && !params.filters.name && !params.filters.country) {
        sql += " on code like '" + params.filters.code.toLowerCase() + "' and (short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%')"
    } else if (params.filters.code && params.filters.name && !params.filters.country && !params.filters.q) {
        sql += " on code like '" + params.filters.code.toLowerCase() + "' and name like '%" + params.filters.name + "%'"
    }
    if ((params.filters.q && !params.filters.country && !params.filters.name && !params.filters.code)) {
        sql += " on short_name like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%'";
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " where les.id=cc.salaryunit_id order by " + params.sorting.sort + " limit " + (params.paging.limitstart - 1) + " , " + params.paging.limitend;
    } else if (params.paging.limitend && !params.sorting.sort) {
        sql += " where les.id=cc.salaryunit_id limit " + params.paging.limitend;
    }
    else if (params.paging.limitend && params.sorting.sort) {
        sql += " where les.id=cc.salaryunit_id order by " + params.sorting.sort + " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, result) {
        if (err) {
            callback(err.sqlMessage, result)
        } else {
            callback(err, result)
        }
    });
};
module.exports = LookupCountryCurrenciesModel;