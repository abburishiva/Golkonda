var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    async = require('async'),
    log;
function ChoiceQuestionModel() {
    this.modelType = 'mySql';
    this.dbMySQL = connection;
    this.tableOnly = "select cq.*,DATE_FORMAT(cq.lastmoddatetime,'%m-%d-%Y %H:%i:%s') as lastmoddatetime,'Choice' as questiontype from choice_question cq ,subject s,common_level cl where cq.subjectid=s.id and cq.levelid=cl.id";
    this.deatailTableSQL = "cq.id,cq.question,cq.preparetime,cq.choice1,cq.choice2,cq.choice3,cq.choice4,cq.answer,cq.time,s.id as subject__id,s.categoryid as subject__categoryid,s.name as subject__name,s.icon_class as subject__icon_class,s.description as subject__description,cl.id as common_level__id,cl.entityid as common_level__entityid,cl.name as common_level__name,cl.display_name as common_level__display_name,cl.description as common_level__description,cl.enabled as common_level__enabled,cq.reviewDone,cq.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("cq.*", this.deatailTableSQL);
    log = new Logger();
    log.info("This is ChoiceQuestionModel Constructor");
}
ChoiceQuestionModel.prototype.find = function (params, callback) {
    log.info("This is ChoiceQuestionModel find function:-");
    var sql = this.tableOnly,
        self = this;
    log.info("This is ChoiceQuestionModel query");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.subject) {
        sql += " and lower(s.name) like '" + params.filters.subject.toLowerCase() + "'";
    }
    if (params.filters.subjectid) {
        sql += ' and s.id in (' + params.filters.subjectid + ')';
    }
    if (params.filters.levelid) {
        sql += " and cl.id=" + params.filters.levelid;
    }
    if (params.filters.randomQuiz) {
        sql += " and cq.id in (" + params.filters.randomQuiz + ")";
    }
    if (params.filters.review) {
        sql += " and cq.reviewDone=" + params.filters.review;
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.randomQuiz) {
        sql += " and cq.id in (" + params.paging.randomQuiz + ")";
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + "," + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    self.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info('info at error handling condition of find method of coding questions model in mysqlModels');
            log.error(err);
            return callback(err);
        }
        if (results.length <= 0) {
            return callback(err, results);
        }
        return self.trimQuestions(params, results, callback);
    });
};
ChoiceQuestionModel.prototype.findOne = function (params, id, callback) {
    log.info("This is ChoiceQuestionModel findOne function");
    var sql = this.tableOnly,
        self = this;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cq.id = ' + id;
    self.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info('info at error handling condition of find method of choice question model in mysqlModels');
            log.error(err);
            return callback(err);
        }
        if (results.length <= 0) {
            return callback(err, results);
        }
        self.trimQuestions(params, results, function (err, data) {
            callback(err, data[0]);
        });
    });
};
ChoiceQuestionModel.prototype.create = function (data, callback) {
    log.info("This is ChoiceQuestionModel create function");
    this.dbMySQL.query('INSERT INTO choice_question SET ?', data, function (err, result) {
        log.info("This is ChoiceQuestionModel query function for create");
        if (err) {
            log.info('info at error handling condition of create method of choice question model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (result) {
                log.info("choice questions posting results:");
                data.id = result.insertId;
            }
            callback(err, data);
        }
    });
};
ChoiceQuestionModel.prototype.update = function (id, data, callback) {
    log.info("This is ChoiceQuestionModel update function");
    this.dbMySQL.query('UPDATE choice_question SET ? WHERE id = ' + id, data, function (err) {
        log.info('info at update method of choice questions model in mysqlModels:-');
        log.info('info at err handling function of update method in ChoiceQuestionModel model in mysql models');
        log.error(err);
        callback(err, data);
    });
};
ChoiceQuestionModel.prototype.remove = function (id, callback) {
    log.info("This is ChoiceQuestionModel remove function");
    this.dbMySQL.query('DELETE FROM choice_question WHERE id = ' + id, callback);
};
ChoiceQuestionModel.prototype.search = function (params, callback) {
    log.info("This is ChoiceQuestionModel search function");
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name.toLowerCase() + "%'";
    }
    if (params.question) {
        sql += " and  lower(cq.question)  like '%" + params.question.toLowerCase() + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info("This is ChoiceQuestionModel query function for search");
        if (err) {
            log.error(err);
            callback(err);
        } else {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(results, callback);
            } else {
                callback(err, results);
            }
        }
    });
};
ChoiceQuestionModel.prototype.trimQuestions = function (params, results, callback) {
    log.info("This is ChoiceQuestionModel trimQuestions");
    var questionsArray = [], count = results.length;
    async.each(results, function (item) {
        count -= 1;
        if (item && item.question) {
            item.trimquestion = item.question.replace(/<[^>]+>/gm, '');
        }
        questionsArray.push(item);
        if (count === 0) {
            if (params.type && params.type.toLowerCase() === 'all')
                return jsonUtil.restructureJSONArray(questionsArray, callback);
            log.info("this is ChoiceQuestionModel trimQuestions function and return results");
            return callback(null, questionsArray);

        }
    });
};
module.exports = ChoiceQuestionModel;
