var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    async = require('async'),
    log;
function AudioQuestionsModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    log = new Logger();
    this.tableOnly = "select aq.*,'Audio' as questiontype  from  audio_question aq , subject s,common_level cl where aq. subjectid=s.id  and aq.levelid=cl.id";
    this.deatailTableSQL = "aq.id,aq.question,aq.reviewDone,aq.preparetime,aq.time,s.id as subject__id,s.name as subject__name,s.icon_class as subject__icon_class,cl.id as common_level__id,cl.name as common_level__name";
    this.tableWithDependenciesSQL = this.tableOnly.replace("aq.*", this.deatailTableSQL);
    log.info("This is AudioQuestionsModel Constructor");
}
AudioQuestionsModel.prototype.find = function (params, callback) {
    log.info("This is AudioQuestionsModel findAll");
    var sql = this.tableOnly, self = this;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " And lower(s.name)like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.question) {
        sql += " And lower(aq.question)='" + params.filters.question.toLowerCase() + "'";
    }
    if (params.filters.answer) {
        sql += " And lower(aq.answer)='" + params.filters.answer.toLowerCase() + "'";
    }
    if (params.filters.subjectid) {
        sql += " And s.id in (" + params.filters.subjectid + ")"
    }
    if (params.filters.review) {
        sql += " And aq.reviewDone = " + params.filters.review;
    }
    if (params.filters.levelid) {
        sql += " And cl.id=" + params.filters.levelid;
    }
    if (params.filters.randomQuiz) {
        sql += " and aq.id in (" + params.filters.randomQuiz + " )";
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    self.dbMySQL.query(sql, function (err, results) {
        log.info('info at  whiteboard_question questions model in mysqlModels');
        if (err) {
            log.info('info at error handling condition of find method of whiteboard_question questions model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            log.info("This is AudioQuestionsModel findAll and  no resuluts found");
            if (results.length <= 0) {
                callback(null, results);
            } else {
                log.info("This is AudioQuestionsModel findAll and send results");
                self.trimQuestions(params, results, callback);
            }
        }
    });
};
AudioQuestionsModel.prototype.findOne = function (params, id, callback) {
    log.info("This is AudioQuestionsModel findOne");
    var sql = this.tableOnly, self = this;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and aq.id = ' + id;
    self.dbMySQL.query(sql, function (err, results) {
        log.info("This is AudioQuestionsModel findOne and query ");
        if (err) {
            log.info('info at error handling condition of find method of whiteboard_question questions model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (results.length <= 0) {
                callback(null, results);
            } else {
                log.info("This is AudioQuestionsModel findOne and send results");
                self.trimQuestions(params, results, function (err, data) {
                    callback(err, data[0]);
                });
            }
        }
    });
};
AudioQuestionsModel.prototype.create = function (data, callback) {
    log.info("This is AudioQuestionsModel create ");
    this.dbMySQL.query('INSERT INTO audio_question SET ?', data, function (err, result) {
        if (err) {
            log.error(err);
            callback(err);
        } else {
            if (result) {
                data.id = result.insertId;
            }
            log.info("This is AudioQuestionsModel create and successfully");
            callback(err, data);
        }
    });
};
AudioQuestionsModel.prototype.update = function (id, data, callback) {
    log.info("This is AudioQuestionsModel update ");
    this.dbMySQL.query('UPDATE audio_question SET ? WHERE id = ' + id, data, function (err) {
        log.info('info at err handling function of update method in AudioQuestionsModel model in mysql models');
        log.error(err);
        callback(err, data);
    });
};
AudioQuestionsModel.prototype.remove = function (id, callback) {
    log.info("This is AudioQuestionsModel remove ");
    this.dbMySQL.query('DELETE FROM audio_question WHERE id = ' + id, callback);
};
AudioQuestionsModel.prototype.search = function (params, callback) {
    log.info("This is AudioQuestionsModel search ");
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name.toLowerCase() + "%'";
    }
    if (params.question) {
        sql += " and  aq.question  like '%" + params.question.toLowerCase() + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            callback(err);
        } else {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(results, callback);
            } else {
                log.info("This is AudioQuestionsModel search and send results");
                callback(err, results);
            }
        }
    });
};
AudioQuestionsModel.prototype.trimQuestions = function (params, results, callback) {
    log.info("This is AudioQuestionsModel trimQuestions");
    var questionsArray = [], count = results.length;
    async.each(results, function (item) {
        count = count - 1;
        if (item && item.question) {
            item.trimquestion = item.question.replace(/<[^>]+>/gm, '');
        }
        questionsArray.push(item);
        if (count === 0) {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(questionsArray, callback);
            } else {
                log.info("this is AudioQuestionsModel trimQuestions function and return results");
                callback(null, questionsArray);
            }
        }
    });
};
module.exports = AudioQuestionsModel;
