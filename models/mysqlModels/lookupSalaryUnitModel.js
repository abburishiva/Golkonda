var connection = require('../../utils/db/mysqlConnect'),
    obj;
function LookupSalaryUnitModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT les.*,DATE_FORMAT(les.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM lookup_emp_salary_unit les where 1=1';
}
function trim(data) {
    var keys = Object.keys(data);
    obj = {};
    if (data.name.trim()) {
        for (var i in keys) {
            obj[keys[i]] = data[keys[i]].toLowerCase().trim();
        }
    }
    return obj;
}

LookupSalaryUnitModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.name) {
        sql += " and (les.name) like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.code) {
        sql += " and (les.code) like '" + params.filters.code.toLowerCase() + "' ";
    }
    if (params.filters.symbolName) {
        sql += " and (les.symbol_name) like '" + params.filters.symbolName.toLowerCase() + "' ";
    }
    if (params.filters.q) {
        sql += " AND lower(les.name) like '%" + params.filters.q + "%' or symbol like '%" + params.filters.q + "%' or symbol_name like '%" + params.filters.q + "%' or code like '%" + params.filters.q + "%' ";
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, result) {
        callback(err, result);
    });
};
LookupSalaryUnitModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and les.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
LookupSalaryUnitModel.prototype.create = function (data, callback) {
    trim(data);
    this.dbMySQL.query('INSERT INTO lookup_emp_salary_unit SET ?', obj, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
LookupSalaryUnitModel.prototype.update = function (id, data, callback) {
    trim(data);
    this.dbMySQL.query('UPDATE lookup_emp_salary_unit SET ? WHERE id = ' + id, obj, function (err) {
        callback(err, data);
    });
};
LookupSalaryUnitModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM lookup_emp_salary_unit WHERE id = ' + id, callback);
};
LookupSalaryUnitModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM lookup_emp_salary_unit where name like '%" + params.name + "%'or code like '%" + params.code + "%'", callback);
};
module.exports = LookupSalaryUnitModel;