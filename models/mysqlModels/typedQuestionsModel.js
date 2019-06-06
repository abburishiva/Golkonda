var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    jsonUtil = require('../../utils/jsonUtil'),
    async = require('async'),
    log;
function TypedQuestionsModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    log = new Logger();
    this.tableOnly = "select tq.*, 'Typed' as questiontype  from  typed_question tq, common_level cl,subject s where tq.levelid=cl.id and tq.subjectid=s.id";
    this.deatailTableSQL = "tq.id, tq.question,tq.reviewDone, tq.preparetime,  tq.time,s.id as subject__id,s.name as subject__name,s.icon_class as subject__icon_class, cl.id as common_level__id,cl.name as common_level__name";
    this.tableWithDependenciesSQL = this.tableOnly.replace("tq.*", this.deatailTableSQL);
    log.info("This is TypedQuestionsModel Constructor");
}
TypedQuestionsModel.prototype.find = function (params, callback) {
    log.info('info at find method in TypedQuestionsModel and params are');
    var sql = this.tableOnly,
        self = this;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.question) {
        sql += " And lower(tq.question)= '" + params.filters.question.toLowerCase() + "' ";
    }
    if (params.filters.levelid) {
        sql += " And cl.id=" + params.filters.levelid;
    }
    if (params.filters.subjectid) {
        sql += ' and s.id in (' + params.filters.subjectid + ')';
    }
    if (params.filters.randomQuiz) {
        sql += " and tq.id in (" + params.filters.randomQuiz + " )";
    }
    if (params.filters.review) {
        sql += " and tq.reviewDone=" + params.filters.review;
    }
    if (params.paging.randomQuiz) {
        sql += " and tq.id in (" + params.paging.randomQuiz + " )";
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
        log.info('info at  typed_question  model in mysqlModels');
        if (err) {
            log.info('info at error handling condition of find method of typed_question model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            log.info("This is TypedQuestionsModel findAll and  no results found");
            if (results.length <= 0) {
                callback(null, results);
            } else {
                log.info("This is TypedQuestionsModel findAll and send results");
                self.trimQuestions(params, results, callback);
            }
        }
    });
};
TypedQuestionsModel.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne of typed_questions model and id is ');
    var sql = this.tableOnly,
        self = this;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and tq.id = ' + id;
    self.dbMySQL.query(sql, function (err, results) {
        log.info("This is TypedQuestionsModel findOne and query");
        if (err) {
            log.info('info at error handling condition of find method of TypedQuestionsModel in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (results.length <= 0) {
                callback(null, results);
            } else {
                log.info("This is TypedQuestionsModel findOne and send results");
                self.trimQuestions(params, results, function (err, data) {
                    callback(err, data[0]);
                });
            }
        }
    });
};
TypedQuestionsModel.prototype.create = function (data, callback) {
    log.info("This is TypedQuestionsModel create and data");
    this.dbMySQL.query('INSERT INTO typed_question SET ?', data, function (err, result) {
        if (err) {
            log.info('info at error handling condition of create method of TypedQuestionsModel in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (result) {
                data.id = result.insertId;
            }
            log.info('info at TypedQuestionsModel create method and result data is');
            callback(err, data);
        }
    });
};
TypedQuestionsModel.prototype.update = function (id, data, callback) {
    log.info('info at TypedQuestionsModel update method and  data is');
    this.dbMySQL.query('UPDATE typed_question SET ? WHERE id = ' + id, data, function (err) {
        log.info('info at error handling condition of update method of TypedQuestionsModel in mysqlModels');
        log.error(err);
        callback(err,data);
    });
};
TypedQuestionsModel.prototype.remove = function (id, callback) {
    log.info('info at TypedQuestionsModel remove method and  id is');
    this.dbMySQL.query('DELETE FROM typed_question WHERE id = ' + id, callback);
};
TypedQuestionsModel.prototype.search = function (params, callback) {
    log.info("This is TypedQuestionsModel search ");
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name.toLowerCase() + "%'";
    }
    if (params.question) {
        sql += " and  tq.question  like '%" + params.question.toLowerCase() + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            callback(err);
        } else {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(results, callback);
            } else {
                log.info("This is TypedQuestionsModel search and send results");
                callback(err, results);
            }
        }
    });
};
TypedQuestionsModel.prototype.trimQuestions = function (params, results, callback) {
    log.info("This is trimQuestions function in TypedQuestionsModel");
    var questionsArray = [], count = results.length;
    log.info("info at type all  trimQuestions function in TypedQuestionsModel");
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
                log.info("This is trimQuestions in TypedQuestionsModel and send data");
                callback(null, questionsArray);
            }
        }
    });
};
module.exports = TypedQuestionsModel;
