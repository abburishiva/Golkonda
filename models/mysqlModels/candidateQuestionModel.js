var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CandidateQuestionModel() {
    this.modelType = 'mySql';
    this.dbMySQL = connection;
    this.tableOnly = 'select cq.*,DATE_FORMAT(cq.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from candidate_question cq,subject s ,class_questions cqq ,rec_candidate rc where cq.questionid=cqq.id and cq.candidateid=rc.id and cqq.subjectid=s.id';
    this.deatailTableSQL = 'cq.id,rc.id as rec_candidate__id,rc.batchid as rec_candidate__batchid,rc.candidateid as rec_candidate__candidateid,rc.statusid as rec_candidate__statusid,rc.leadid as rec_candidate__leadid,rc.portalid as rec_candidate__portalid,rc.notes as rec_candidate__notes,cqq.id as class_question__id,s.id as class_question__subject__id,s.categoryid as class_question__subject__categoryid,s.name as class_question__subject__name,s.icon_class as class_question__subject__icon_class,s.description as class_question__subject__description,cqq.question as class_question__question,cq.answer,cq.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cq.*", this.deatailTableSQL);
}
CandidateQuestionModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.filters.candidateid) {
        sql += ' and rc.id = ' + params.filters.candidateid;
    }
    if (params.filters.questionid) {
        sql += ' and cqq.id = ' + params.filters.questionid;
    }
    if (params.filters.subjectid) {
        sql += ' and cqq.subjectid = ' + params.filters.subjectid;
    }
    if (params.filters.question) {
        sql += "and cqq.question like '" + params.filters.question + "'";
    }
    if (params.filters.answer) {
        sql += " and cq.answer like '" + params.filters.answer + "'";
    }
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
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
CandidateQuestionModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cq.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(err, results[0]);
        }
    });
};
CandidateQuestionModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO candidate_question SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CandidateQuestionModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE candidate_question SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CandidateQuestionModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM candidate_question WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
CandidateQuestionModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name + "%'";
    }
    if (params.question) {
        sql += " and  (cqq.question)  like '%" + params.question + "%'";
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
module.exports = CandidateQuestionModel;