var connection = require('../../utils/db/mysqlConnect');
function LookupWorkStatusModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT lws.*,DATE_FORMAT(lws.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime  FROM lookup_work_status lws WHERE 1=1 ';
}
LookupWorkStatusModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.name) {
        sql += " AND lower(lws.name)  like '" + params.filters.name.toLowerCase() + "'";
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
    this.dbMySQL.query(sql, callback);
};
LookupWorkStatusModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' AND lws.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
LookupWorkStatusModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO lookup_work_status SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
LookupWorkStatusModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE lookup_work_status SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
LookupWorkStatusModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM lookup_work_status WHERE id = ' + id, callback);
};
LookupWorkStatusModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM lookup_work_status  where name like '%" + params.name + "%' or description like '%" + params.name + "%' ", callback);
};
module.exports = LookupWorkStatusModel;