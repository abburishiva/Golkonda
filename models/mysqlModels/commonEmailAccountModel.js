var connection = require('../../utils/db/mysqlConnect'),
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
var encrypto = function (text) {
    var cipher = crypto.createCipher(algorithm, password), crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
function CommonEmailAccountModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = 'select cem.*,DATE_FORMAT(cem.lastmodedatetime,"%m-%d-%Y %H:%i:%s") as lastmodedatetime from common_email_account cem where 1=1 ';
}
CommonEmailAccountModel.prototype.modelType = 'mySql';
CommonEmailAccountModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.email) {
        sql += "and lower(cem.email) like '" + params.filters.email.toLowerCase() + "' ";
    }
    if (params.filters.master_email) {
        sql += "and lower(cem.master_email) like '" + params.filters.master_email.toLowerCase() + "' ";
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
CommonEmailAccountModel.prototype.findOne = function (params, id, callback) {
    this.dbMySQL.query(this.tableOnly + 'and cem.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
CommonEmailAccountModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO common_email_account SET ?', data, function (err, result) {
        password = encrypto(data.password);
        if (result) {
            data.id = result.insertId;
            data.password = password;
        }
        callback(err, data);
    });
};
CommonEmailAccountModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE common_email_account SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CommonEmailAccountModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('delete FROM common_email_account WHERE id = ' + id, callback);
};
CommonEmailAccountModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("select * FROM common_email_account  where email like '%" + params.email + "%' or master_email like '%" + params.master_email + "%'", callback);
};
module.exports = CommonEmailAccountModel;
