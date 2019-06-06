var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    async = require('async'),
    log;
function WhiteboardQuestionModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = "select wq.*, 'Whiteboard' as questiontype  from  whiteboard_question wq , subject s,common_level cl where wq. subjectid=s.id  and  wq.levelid=cl.id";
    this.deatailTableSQL = "wq.id,wq.reviewDone,wq.question,wq.time,s.id as subject__id,s.name as subject__name,s.icon_class as subject__icon_class,cl.id as common_level__id,cl.name as common_level__name, wq.lastmoddatetime,wq.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("wq.*", this.deatailTableSQL);
    log = new Logger();
    log.info("This is WiteboardQuestionModel Constructor...");
}

WhiteboardQuestionModel.prototype.find = function (params, callback) {
    log.info("this is WiteboardQuestionModel find function:");
    var sql = this.tableOnly,
        self = this;
    log.info("this is WiteboardQuestionModel select statement:-");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.question) {
        sql += " And lower(wq.question)='" + params.filters.question.toLowerCase() + "'";
    }
    if (params.filters.name) {
        sql += " And lower(s.name)like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.levelid) {
        sql += " And cl.id=" + params.filters.levelid;
    }
    if (params.filters.review) {
        sql += " and wq.reviewDone=" + params.filters.review;
    }
    if (params.filters.subjectid) {
        sql += ' and s.id in (' + params.filters.subjectid + ')';
    }
    if (params.filters.randomQuiz) {
        sql += " and wq.id in (" + params.filters.randomQuiz + " )";
    }
    if (params.paging.randomQuiz) {
        sql += " and wq.id in (" + params.paging.randomQuiz + " )";
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
        if (err) {
            log.info('info at error handling condition of find method of whiteboard_question questions model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (results.length <= 0) {
                callback(null, results);
            } else {
                self.trimQuestions(params, results, callback);
            }
        }
    });
};
WhiteboardQuestionModel.prototype.findOne = function (params, id, callback) {
    log.info("this is WiteboardQuestionModel findOne function");
    var sql = this.tableOnly,
        self = this;
    log.info("this is WiteboardQuestionModel select statement:-");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and wq.id = ' + id;
    self.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info('info at error handling condition of find method of whiteboard_question questions model in mysqlModels');
            log.error(err);
            callback(err);
        } else {
            if (results.length <= 0) {
                callback(null, results);
            } else {
                self.trimQuestions(params, results, function (err, data) {
                    callback(err, data[0]);
                });
            }
        }
    });
};
WhiteboardQuestionModel.prototype.create = function (data, callback) {
    log.info("this is WiteboardQuestionModel create function");
    this.dbMySQL.query('INSERT INTO whiteboard_question SET ?', data, function (err, result) {
        if (err) {
            log.info('info at err handling function of create method in whiteboardQuestions model in mysql models');
            log.error(err);
            callback(err);
        } else {
            log.info("inserted results of WiteboardQuestionModel questions models:-");
            if (result) {
                data.id = result.insertId;
            }
            callback(err, data);
        }
    });
};
WhiteboardQuestionModel.prototype.update = function (id, data, callback) {
    log.info("this is WiteboardQuestionModel update function");
    this.dbMySQL.query('UPDATE whiteboard_question SET ? WHERE id = ' + id, data, function (err) {
        log.error(err);
        callback(err, data);
    });
};
WhiteboardQuestionModel.prototype.remove = function (id, callback) {
    log.info("this is WiteboardQuestionModel remove function:");
    this.dbMySQL.query('DELETE FROM whiteboard_question WHERE id = ' + id, callback);
};
WhiteboardQuestionModel.prototype.search = function (params, callback) {
    log.info("this is WiteboardQuestionModel search function");
    var sql = this.tableOnly;
    log.info("this is WiteboardQuestionModel select statement:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name.toLowerCase() + "%'";
    }
    if (params.question) {
        sql += " and  wq.question  like '%" + params.question.toLowerCase() + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info('info at err handling function of search method in whiteboardQuestions model in mysql models');
            log.error(err);
            callback(err);
        } else {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(results, callback);
            } else {
                log.info('info at search method of whiteboard_question in mysql models');
                callback(err, results);
            }
        }
    });
};

WhiteboardQuestionModel.prototype.trimQuestions = function (params, results, callback) {
    log.info("this is WiteboardQuestionModel trimQuestions function");
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
                log.info("this is WhiteboardQuestionModel trimQuestions function and return results");
                callback(null, questionsArray);
            }
        }
    });
};
module.exports = WhiteboardQuestionModel;
