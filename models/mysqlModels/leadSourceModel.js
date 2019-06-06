var connection = require('../../utils/db/mysqlConnect');
function LeadSourceModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT ls.*,DATE_FORMAT(ls.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime FROM lead_source ls WHERE 1=1 ';
}
LeadSourceModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.type) {
        sql += " AND lower(ls.type) like'" + params.filters.type.toLowerCase() + "' ";
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, callback);
};
LeadSourceModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' AND ls.id = ' + id, callback);
};
LeadSourceModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO lead_source SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
LeadSourceModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE lead_source SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
LeadSourceModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM lead_source WHERE id = ' + id, callback);

};
LeadSourceModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM lead_source  where type like '%" + params.type + "%' or description like '%" + params.description + "%'", callback);
};
module.exports = LeadSourceModel;
