var connection = require('../../utils/db/talentMetasqlConnect.js'),
    _ = require('lodash'),
    typed;
function AnalyticsQuestionModel() {
    var self = this;
    self.dbMySQL = connection;
    self.modelType = 'mySql';
}
function analyticsQuestionType(mysql, params, callback) {
    var sql, self = this;
    if (params.filters.questiontype.toLowerCase() === 'choice') {
        sql = "select ca.*, 'choice' as 'questiontype' from choice_analytics ca where 1=1";
    } else if (params.filters.questiontype.toLowerCase() === 'coding') {
        sql = "select ca.*, 'coding' as 'questiontype' from coding_analytics ca where 1=1";
    } else if (params.filters.questiontype.toLowerCase() === 'video') {
        sql = "select ca.*, 'video' as 'questiontype' from video_analytics ca where 1=1";
    } else if (params.filters.questiontype.toLowerCase() === 'audio') {
        sql = "select ca.*, 'audio' as 'questiontype' from audio_analytics ca where 1=1";
    } else if (params.filters.questiontype.toLowerCase() === 'typed') {
        sql = "select ca.*, 'typed' as 'questiontype' from typed_analytics ca where 1=1";
    }
    if (params.filters.subjectid) {
        sql += " AND ca.subjectid in (" + params.filters.subjectid + ")";
    }
    if (params.filters.levelid) {
        sql += " AND ca.levelid = " + params.filters.levelid;
    }
    if (params.sorting.sort) {
        sql += " order by " + params.sorting.sort;
    }
    if (params.filters.questionid) {
        sql += " AND ca.questionid = " + params.filters.questionid;
    }
    if (params.filters.count) {
        sql += " AND ca.count = " + params.filters.count;
    }
    if (params.filters.review) {
        sql += " AND ca.review = '" + params.filters.review + "'";
    }
    mysql.query(sql, function (err, results) {
        callback(err, results);
    });
}

AnalyticsQuestionModel.prototype.find = function (params, callback) {
    var sql, self = this;
    var questiontype = params.filters.questiontype !== undefined ? params.filters.questiontype.match(/[^,]+/g) : 'Alltypes';
    if (questiontype && (questiontype.length > 1 || questiontype === 'Alltypes')) {
        params.filters.questiontype = 'video';
        analyticsQuestionType(self.dbMySQL, params, function (err, videoData) {
            params.filters.questiontype = 'coding';
            analyticsQuestionType(self.dbMySQL, params, function (err, codingData) {
                params.filters.questiontype = 'choice';
                analyticsQuestionType(self.dbMySQL, params, function (err, choiceData) {
                    params.filters.questiontype = 'audio';
                    analyticsQuestionType(self.dbMySQL, params, function (err, audioData) {
                        params.filters.questiontype = 'typed';
                        analyticsQuestionType(self.dbMySQL, params, function (err, typedData) {
                            Array.prototype.push.apply(videoData, codingData);
                            Array.prototype.push.apply(videoData, choiceData);
                            Array.prototype.push.apply(videoData, audioData);
                            Array.prototype.push.apply(videoData, typedData);
                            if (params.filters.type !== 'all' && questiontype !== 'Alltypes') {
                                callback(err, _.filter(videoData, _.conforms({
                                    "questiontype": function (n) {
                                        return (questiontype.indexOf(n.toLowerCase()) > -1);
                                    }
                                })));
                            } else {
                                callback(err, videoData);
                            }
                        })
                    })
                })
            })
        })
    } else if (params.filters.questiontype !== undefined) {
        if (params.filters.questiontype.toLowerCase() === 'choice') {
            analyticsQuestionType(self.dbMySQL, params, function (err, choiceData) {
                if (err) {
                    callback(err, choiceData);
                } else {
                    callback(err, choiceData);
                }
            })
        } else if (params.filters.questiontype.toLowerCase() === 'coding') {
            analyticsQuestionType(self.dbMySQL, params, function (err, codingData) {
                if (err) {
                    callback(err, codingData);
                } else {
                    callback(err, codingData);
                }
            })
        } else if (params.filters.questiontype.toLowerCase() === 'video') {
            analyticsQuestionType(self.dbMySQL, params, function (err, videoData) {
                if (err) {
                    callback(err, videoData);
                } else {
                    callback(err, videoData);
                }
            })
        } else if (params.filters.questiontype.toLowerCase() === 'audio') {
            analyticsQuestionType(self.dbMySQL, params, function (err, audioData) {
                if (err) {
                    callback(err, audioData);
                } else {
                    callback(err, audioData);
                }
            })
        } else if (params.filters.questiontype.toLowerCase() === 'typed') {
            analyticsQuestionType(self.dbMySQL, params, function (err, typedData) {
                if (err) {
                    callback(err, typedData);
                } else {
                    callback(err, typedData);
                }
            })
        } else {
            callback({message: "Bad Request"});
        }

    }
};
module.exports = AnalyticsQuestionModel;


