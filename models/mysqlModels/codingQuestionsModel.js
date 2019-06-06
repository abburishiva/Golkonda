var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    async = require('async'),
    log;
function CodingQuestionModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = "select cq.* ,DATE_FORMAT(cq.lastmoddatetime,'%m-%d-%Y,%H:%i:%s') as lastmoddatetime,'Coding' as questiontype from  coding_question cq , subject s,common_level cl where cq. subjectid=s.id and cq.levelid=cl.id";
    this.deatailTableSQL = "cq.id,cq.preparetime,cq.reviewDone,cq.testCasesRequired,cq.compilationRequired,s.id as subject__id,s.categoryid as subject__categoryid,s.name as subject__name,s.icon_class as subject__icon_class,s.description as subject__description,cl.id as common_level__id,cl.entityid as common_level__entityid,cl.name as common_level__name,cl.display_name as common_level__display_name,cl.description as common_level__description,cl.enabled as common_level__enabled,cq.question,cq.hint,cq.answer,cq.testcases,cq.time,cq.template,cq.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("cq.*", this.deatailTableSQL);
    log = new Logger();
    log.info("This is CodingQuestionModel Constructor...");
}
CodingQuestionModel.prototype.find = function (params, callback) {
    log.info("this is CodingQuestionModel find function");
    var sql = this.tableOnly, self = this;
    log.info("this is CodingQuestionModel select statement:-");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " and lower(s.name) like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.subjectid) {
        sql += ' and s.id in (' + params.filters.subjectid + ')';
    }
    if (params.filters.levelid) {
        sql += ' and cl.id =' + params.filters.levelid;
    }
    if (params.filters.randomQuiz) {
        sql += " and cq.id in (" + params.filters.randomQuiz + ")";
    }
    if (params.filters.review) {
        sql += " and cq.reviewDone=" + params.filters.review;
    }
    if (params.paging.randomQuiz) {
        sql += " and cq.id in (" + params.paging.randomQuiz + ")";
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + "," + params.paging.limitend;
    }
    self.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info('info at error handling condition of find method of coding questions model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (results.length <= 0) {
                callback(err, results);
            } else {
                self.trimQuestions(params, results, callback);
            }
        }
    });
};
CodingQuestionModel.prototype.findOne = function (params, id, callback) {
    log.info("this is CodingQuestionModel findOne function");
    var sql = this.tableOnly, self = this;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and cq.id = ' + id;
    self.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info("info at err handling function in findOne method of coding questions");
            log.error(err);
            callback(err);
        } else {
            if (results.length <= 0) {
                callback(err, results);
            } else {
                self.trimQuestions(params, results, function (err, data) {
                    callback(err, data[0]);
                });
            }
        }
    });
};
CodingQuestionModel.prototype.create = function (data, callback) {
    log.info("this is CodingQuestionModel findOne function");
    this.dbMySQL.query('INSERT INTO  coding_question SET ?', data, function (err, result) {
        if (err) {
            log.info("info at err handling function in create method of coding questions");
            log.error(err);
            callback(err);
        } else {
            if (result) {
                log.info("CodingQuestionModel data posting result");
                data.id = result.insertId;
            }
            callback(err, data);
        }
    });
};
CodingQuestionModel.prototype.update = function (id, data, callback) {
    log.info("this is CodingQuestionModel update function");
    this.dbMySQL.query('UPDATE  coding_question SET ? WHERE id = ' + id, data, function (err) {
        log.info('info at err handling function of update method in CodingQuestionModel model in mysql models');
        log.error(err);
        callback(err, data);
    });
};
CodingQuestionModel.prototype.remove = function (id, callback) {
    log.info('info at  remove method of coding questions model in mysqlModels');
    this.dbMySQL.query('DELETE FROM  coding_question WHERE id = ' + id, callback);
};
CodingQuestionModel.prototype.search = function (params, callback) {
    log.info("this is CodingQuestionModel search function");
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
    if (params.hint) {
        sql += " and  lower(cq.hint)  like '%" + params.hint.toLowerCase() + "%'";
    }
    if (params.displayname) {
        sql += " and  lower(cl.displayname)  like '%" + params.displayname.toLowerCase() + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info("info at err handling function in search method of coding questions");
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
CodingQuestionModel.prototype.trimQuestions = function (params, results, callback) {
    log.info("This is CodingQuestionModel trimQuestions");
    var questionsArray = [], count = results.length;
    async.each(results, function (item) {
        count -= 1;
        if (item && item.question) {
            item.trimquestion = item.question.replace(/<[^>]+>/gm, '');
        }
        questionsArray.push(item);
        if (count === 0) {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(questionsArray, callback);
            } else {
                log.info("this is CodingQuestionModel trimQuestions function and return results");
                callback(null, questionsArray);
            }
        }
    });
};
module.exports = CodingQuestionModel;
