var connection = require('../../utils/db/mysqlConnect');
function RecordinglistBackupModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'SELECT rlb.*,DATE_FORMAT(rlb.recordingdate,"%m-%d-%Y %H:%i:%s") as recordingdate,DATE_FORMAT(rlb.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from recordingslist_backup rlb where 1=1';
}
RecordinglistBackupModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.name) {
        sql += " and name like '" + params.filters.name.toLowerCase() + "' ";
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
RecordinglistBackupModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + ' and rlb.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
RecordinglistBackupModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO recordingslist_backup SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
RecordinglistBackupModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE recordingslist_backup SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
RecordinglistBackupModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM recordingslist_backup WHERE id = ' + id, callback);

};
RecordinglistBackupModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM recordingslist_backup  where name like '%" + params.name + "%'", callback);
};
module.exports = RecordinglistBackupModel;
