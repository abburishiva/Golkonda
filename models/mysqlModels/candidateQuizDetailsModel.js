var connection = require('../../utils/db/mysqlConnect');
function CandidateQuizDetailsModel() {
    this.modelType = 'mySql';
    this.dbMySQL = connection;
    this.tableOnly = 'select cqd.*,DATE_FORMAT(lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from candidate_quiz_details cqd where 1=1 ';
}
CandidateQuizDetailsModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.questionid) {
        sql += " and cqd.questionid = " + params.filters.questionid;
    }
    if (params.filters.answer) {
        sql += " and cqd.answer like '" + params.filters.answer.toLowerCase() + "' ";
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
CandidateQuizDetailsModel.prototype.findOne = function (params, id, callback) {
    if (params.type) {
        return this.tableOnly;
    }
    this.dbMySQL.query(this.tableOnly + ' and cqd.id = ' + id, function (err, result) {
        callback(err, result[0]);
    });
};
CandidateQuizDetailsModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO candidate_quiz_details SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CandidateQuizDetailsModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE candidate_quiz_details SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CandidateQuizDetailsModel.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM candidate_quiz_details WHERE id = ' + id, callback);

};
CandidateQuizDetailsModel.prototype.search = function (params, callback) {
    this.dbMySQL.query("SELECT * FROM candidate_quiz_details  where questionid like '%" + params.questionid + "%' or answer like '%" + params.answer + "%'", callback);
};
module.exports = CandidateQuizDetailsModel;
