var connection = require('../../utils/db/mysqlConnect'),
    ContactModel = require('./commonContactModel'),
    jsonUtil = require('../../utils/jsonUtil'),
    contact,
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';
var encrypto = function (text) {
    var cipher = crypto.createCipher(algorithm, password),
        crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};
function RecCandidateLoginModel() {
    this.modelType = 'mySql';
    contact = new ContactModel();
    this.dbMySQL = connection;
    this.tableOnly = 'select rcl.*,DATE_FORMAT(rcl.lastlogin,"%m-%d-%Y %H:%i:%s") as lastlogin,DATE_FORMAT(rcl.registereddate,"%m-%d-%Y %H:%i:%s") as registereddate,DATE_FORMAT(rcl.lastmoddatetime, "%m-%d-%Y %H:%i:%s") as lastmoddatetime  from rec_candidate_login rcl ,common_contact cc where rcl.contactid=cc.id';
    this.deatailTableSQL = 'rcl.id,rcl.uname,rcl.passwd,rcl.logincount,rcl.notes,cc.id as common_contact__id,cc.firstname as common_contact__firstname,cc.middlename as common_contact__middlename,cc.email as common_contact__email,cc.phone as common_contact__phone,cc.addressid as common_contact__addressid,cc.secondaryemail as common_contact__secondaryemail,cc.secondaryphone as common_contact__secondaryphone,cc.workemail as common_contact__workemail,cc.workphone as common_contact__workphone,cc.designation as common_contact__designation,cc.dob as common_contact__dob,cc.secondarycontactid as common_contact__secondarycontactid,cc.sourcecontactid as common_contact__sourcecontactid,cc.workaddressid as  common_contact__workaddressid,DATE_FORMAT(cc.entrydate,"%m-%d-%Y %H:%i:%s") as common_contact__entrydate,cc.linkedin as common_contact__linkedin,cc.skype as common_contact__skype,cc.facebook as common_contact__facebook,cc.twitter as common_contact__twitter,rcl.statusid';
    this.tableWithDependenciesSQL = this.tableOnly.replace('rcl.*', this.deatailTableSQL);
}
RecCandidateLoginModel.prototype.createLoginCandidate = function (candidateInfo, callback) {
    this.dbMySQL.query("insert into rec_candidate_login SET ?", candidateInfo, function (err, results) {
        password = encrypto(candidateInfo.passwd);
        candidateInfo.passwd = password;
        if (err) {
            return callback(err, null);
        }
        candidateInfo.id = results.insertId;
        candidateInfo.passwd = password;
        callback(null, candidateInfo);
    });
};
RecCandidateLoginModel.prototype.updateLoginCandidate = function (id, candidateInfo, callback) {
    this.dbMySQL.query('UPDATE rec_candidate_login SET ? WHERE id = ' + id, candidateInfo, function (err, results) {
        password = encrypto(candidateInfo.passwd);
        candidateInfo.passwd = password;
        candidateInfo.id = results.insertId;
        candidateInfo.passwd = password;
        callback(null, candidateInfo);
        if (err) {
            return callback(err);
        }
    });
};
RecCandidateLoginModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.uname) {
        sql += " and lower(rcl.uname) like '" + params.filters.uname.toLowerCase() + "' ";
    }
    if (params.filters.addressid) {
        sql += ' and cc.addressid = ' + params.filters.addressid;
    }
    if (params.filters.contactid) {
        sql += ' and cc.id = ' + params.filters.contactid;
    }
    if (params.filters.firstname) {
        sql += " and cc.firstname like '" + params.filters.firstname.toLowerCase() + "' ";
    }
    if (params.filters.email) {
        sql += " and cc.email like '" + params.filters.email.toLowerCase() + "' ";
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
RecCandidateLoginModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and rcl.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err, null);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(null, results);
        }
    });
};
RecCandidateLoginModel.prototype.create = function (data, callback) {
    var self = this;
    if (data.contact) {
        contact.update(data.contact.id, data.contact, function (err, contactData) {
            if (err) {
                return callback(err);
            }
            data.contactid = contactData.data.id;
            delete data.contact;
            self.createLoginCandidate(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        });
    } else {
        self.createLoginCandidate(data, function (err, result) {
            callback(err, {data: result, type: 'create'});
        });
    }
};
RecCandidateLoginModel.prototype.update = function (id, data, callback) {
    var self = this;
    var params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            if (data.contact) {
                contact.update(data.contact.id, data.contact, function (err, contactData) {
                    if (err) {
                        return callback(err);
                    }
                    data.contactid = contactData.data.id;
                    delete data.contact;
                    self.updateLoginCandidate(id, data, function (err, result) {
                        callback(err, {data: result, type: 'update'});
                    });
                });
            } else {
                self.updateLoginCandidate(id, data, function (err, result) {
                    callback(err, {data: result, type: 'update'});
                });
            }
        } else {
            self.create(data, callback);
        }
    });
};
RecCandidateLoginModel.prototype.remove = function (id, callback) {
    var sql = 'DELETE FROM rec_candidate_login WHERE id = ' + id;
    this.dbMySQL.query(sql, callback);
};
RecCandidateLoginModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.uname) {
        sql += " and  lower(rcl.uname) like '%" + params.uname + "%'";
    }
    if (params.firstname) {
        sql += " and lower(cc.firstname)  like '%" + params.firstname + "%'";
    }
    if (params.email) {
        sql += " and  lower(cc.email)  like '%" + params.email + "%'";
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
module.exports = RecCandidateLoginModel;