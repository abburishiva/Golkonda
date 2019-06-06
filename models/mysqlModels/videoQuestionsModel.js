var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    async = require('async'),
    log;
function VideoQuestionModel() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = "select vq.*,DATE_FORMAT(vq.lastmoddatetime,'%m-%d-%Y %H:%i:%s') as lastmoddatetime,'Video' as questiontype  from  video_question vq , subject s,common_level cl where vq. subjectid=s.id  and vq.levelid=cl.id";
    this.deatailTableSQL = "vq.id,vq.question,vq.reviewDone,vq.preparetime,vq.time,s.id as subject__id,s.name as subject__name,s.icon_class as subject__icon_class,cl.id as common_level__id,cl.name as common_level__name";
    this.tableWithDependenciesSQL = this.tableOnly.replace("vq.*", this.deatailTableSQL);
    log = new Logger();
    log.info("This is VideoQuestionModel Constructor...");
}
VideoQuestionModel.prototype.find = function (params, callback) {
    log.info("this is VideoQuestionModel find function:");
    var sql = this.tableOnly, self = this;
    log.info("this is VideoQuestionModel select statement:-");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.name) {
        sql += " And lower(s.name)like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.filters.question) {
        sql += " And lower(vq.question)='" + params.filters.question.toLowerCase() + "'";
    }
    if (params.filters.subjectid) {
        sql += " and s.id in (" + params.filters.subjectid + ")";
    }
    if (params.filters.levelid) {
        sql += " And cl.id=" + params.filters.levelid;
    }
    if (params.filters.randomQuiz) {
        sql += " and vq.id in (" + params.filters.randomQuiz + " )";
    }
    if (params.filters.review) {
        sql += " and vq.reviewDone=" + params.filters.review;
    }
    if (params.paging.randomQuiz) {
        sql += " and vq.id in (" + params.paging.randomQuiz + " )";
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
            log.info('info at error handling condition of find method of VideoQuestionModel in mysqlModels');
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
VideoQuestionModel.prototype.findOne = function (params, id, callback) {
    log.info("this is VideoQuestionModel findOne function");
    var sql = this.tableOnly, self = this;
    log.info("this is VideoQuestionModel select statement:-");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and vq.id = ' + id;
    self.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info("info at err handling function in findOne method of VideoQuestionModel");
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
VideoQuestionModel.prototype.create = function (data, callback) {
    log.info("this is VideoQuestionModel create function");
    this.dbMySQL.query('INSERT INTO video_question SET ?', data, function (err, result) {
        if (err) {
            log.info('info at err handling function of create method in videoQuestions model in mysql models');
            log.error(err);
            callback(err);
        } else {
            if (result) {
                log.info("inserted results of video questions models:-");
                data.id = result.insertId;
            }
            callback(err, data);
        }
    });
};
VideoQuestionModel.prototype.update = function (id, data, callback) {
    log.info("this is VideoQuestionModel update function");
    this.dbMySQL.query('UPDATE video_question SET ? WHERE id = ' + id, data, function (err) {
        log.info('info at err handling function of update method in videoQuestions model in mysql models');
        log.error(err);
        callback(err, data);
    });
};
VideoQuestionModel.prototype.remove = function (id, callback) {
    log.info("this is VideoQuestionModel remove function:");
    this.dbMySQL.query('DELETE FROM video_question WHERE id = ' + id, callback);
};
VideoQuestionModel.prototype.search = function (params, callback) {
    log.info("this is VideoQuestionModel search function");
    var sql = this.tableOnly;
    log.info("this is VideoQuestionModel select statement:-");
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name.toLowerCase() + "%'";
    }
    if (params.question) {
        sql += " and  vq.question  like '%" + params.question.toLowerCase() + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.info('info at err handling function of search method in videoQuestions model in mysql models');
            log.error(err);
            callback(err);
        } else {
            if (params.type && params.type.toLowerCase() === 'all') {
                jsonUtil.restructureJSONArray(results, callback);
            } else {
                log.info('info at search method of video questions in mysql models');
                callback(err, results);
            }
        }
    });
};
VideoQuestionModel.prototype.trimQuestions = function (params, results, callback) {
    log.info("This is VideoQuestionModel trimQuestions");
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
                log.info("this is VideoQuestionModel trimQuestions function and return results");
                callback(null, questionsArray);
            }
        }
    });
};
module.exports = VideoQuestionModel;
