var mongoose = require('mongoose'),
    async = require('async'),
    Schema = mongoose.Schema,
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/employerQuestionsSchema.js'),
    questionsSchema = new Schema(getSchema),
    QuestionsSchema = mongoose.model('employer_questions', questionsSchema),
    connection = require('../../utils/db/mysqlConnect'),
    _ = require('lodash'),
    log;
function EmployeeQuestionsModel() {
    this.modelType = 'mongo';
    log = new Logger();
    this.questionsSchemaModel = QuestionsSchema;
    this.dbMySQL = connection;
}
EmployeeQuestionsModel.prototype.find = function (params, callback) {
    log.info('info at find method of employer_questions model in mongo models');
    this.questionsSchemaModel.find(params.source, function (err, results) {
        var questionsArray = [];
        if (results.length > 0) {
            async.each(results, function (items) {
                var objects = items.toObject();
                if (objects.question) {
                    objects.trimquestion = objects.question.replace(/<[^>]+>/gm, '');
                }
                questionsArray.push(objects);
            });
        }
        callback(err, questionsArray);
    }).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
EmployeeQuestionsModel.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of employer_questions model in mongo models');
    this.questionsSchemaModel.findOne({_id: id}, function (err, results) {
        var objects;
        if (results) {
            objects = results.toObject();
            if (objects && objects.question) {
                objects.trimquestion = objects.question.replace(/<[^>]+>/gm, '');
            }
            callback(err, objects);
        } else {
            callback(null, results);
        }
    });
};
EmployeeQuestionsModel.prototype.create = function (data, callback) {
    log.info('info at create method of employer_questions model in mongo models');
    this.questionsSchemaModel.create(data, callback);
};
EmployeeQuestionsModel.prototype.update = function (id, data, callback) {
    log.info('info at update method of employer_questions model in mongo models');
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    self.questionsSchemaModel.update(conditions, update, options, callback);
};
EmployeeQuestionsModel.prototype.remove = function (id, callback) {
    log.info('info at remove method of employer_questions model in mongo models');
    this.questionsSchemaModel.remove({_id: id}, callback);
};
EmployeeQuestionsModel.prototype.search = function (params, callback) {
    log.info('info at search method of employer_questions model in mongo models');
    this.questionsSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};

EmployeeQuestionsModel.prototype.findEmpQuestionsCount = function (req, callback) {
    var self = this;
    if (req.params.name === 'library') {
        if (req.decoded.auth_details.is_super===true) {
            self.dbMySQL.query("SELECT common_category.name, count(subject.categoryid) from subject left join common_category on (subject.categoryid= common_category.id) group by common_category.id", function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    self.dbMySQL.query("SELECT (SELECT COUNT(*) FROM audio_question) as audio_question, (SELECT COUNT(*) FROM choice_question ) as choice_question, (SELECT COUNT(*) FROM coding_question) as coding_question, (SELECT COUNT(*) FROM typed_question ) as typed_question, (SELECT COUNT(*) FROM video_question ) as video_question, (SELECT (SELECT COUNT(*) FROM audio_question)  + (SELECT COUNT(*) FROM choice_question ) + (SELECT COUNT(*) FROM coding_question) + (SELECT COUNT(*) FROM typed_question ) + (SELECT COUNT(*) FROM video_question ) )as all_question_count;", function (err, totalQuestions) {
                        if (err) {
                            callback(err, null);
                        } else {
                            self.dbMySQL.query("select subject.id,subject.name,count(subject.id) as count from subject left join audio_question on (subject.id=audio_question.subjectid) group by subject.id;", function (err, audioQuestiond) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    self.dbMySQL.query("select subject.id,subject.name,count(subject.id) as count from subject left join choice_question on (subject.id=choice_question.subjectid) group by subject.id;", function (err, choiseQuestions) {
                                        if (err) {
                                            callback(err, null);
                                        } else {
                                            self.dbMySQL.query("select subject.id,subject.name,count(subject.id) as count from subject left join coding_question on (subject.id=coding_question.subjectid) group by subject.id;", function (err, codingQuestions) {
                                                if (err) {
                                                    callback(err, null);
                                                } else {
                                                    self.dbMySQL.query("select subject.id,subject.name,count(subject.id) as count from subject left join typed_question on (subject.id=typed_question.subjectid) group by subject.id;", function (err, typedQuestions) {
                                                        if (err) {
                                                            callback(err, null);
                                                        } else {
                                                            self.dbMySQL.query("select subject.id,subject.name,count(subject.id) as count from subject left join video_question on (subject.id=video_question.subjectid) group by subject.id;", function (err, videoQuestions) {
                                                                if (err) {
                                                                    callback(err, null);
                                                                } else {
                                                                    self.dbMySQL.query("select total.question,total.lastmoddatetime,total.Source,subject.name from (select subjectid,question,lastmoddatetime,'audio' as source from audio_question union select subjectid,question,lastmoddatetime,'coding' as source from coding_question union select subjectid,question,lastmoddatetime,'choice' as source from choice_question union select subjectid,question,lastmoddatetime,'typed' as source from typed_question union select subjectid,question,lastmoddatetime,'video' as source from video_question order by lastmoddatetime desc) as total join subject on (subject.id=total.subjectid) order by total.lastmoddatetime desc limit 6;", function (err,recentQuestions) {
                                                                        if(err){
                                                                            callback(err, null);
                                                                        }else {
                                                                            var arr = _.concat(audioQuestiond, choiseQuestions, codingQuestions, typedQuestions, videoQuestions);
                                                                            var temp = {};
                                                                            var obj = null;
                                                                            for (var i = 0; i < arr.length; i++) {
                                                                                obj = {
                                                                                    name: arr[i].name,
                                                                                    count: arr[i].count
                                                                                };

                                                                                if (!temp[obj.name]) {
                                                                                    temp[obj.name] = obj;
                                                                                } else {
                                                                                    temp[obj.name].count += obj.count;
                                                                                }
                                                                            }
                                                                            var result = [];
                                                                            for (var j in temp) {
                                                                                result.push(temp[j]);
                                                                            }
                                                                            callback(null, {
                                                                                questionsCount: totalQuestions[0].all_question_count,
                                                                                questionsOnSubjects: _.orderBy(result, ['count'], ['desc']).slice(0, 6),
                                                                                quesOnQuizzes: [
                                                                                    {
                                                                                        _id: 'audio',
                                                                                        count: totalQuestions[0].audio_question
                                                                                    },
                                                                                    {
                                                                                        _id: 'choice',
                                                                                        count: totalQuestions[0].choice_question
                                                                                    },
                                                                                    {
                                                                                        _id: 'coding',
                                                                                        count: totalQuestions[0].coding_question
                                                                                    },
                                                                                    {
                                                                                        _id: 'typed',
                                                                                        count: totalQuestions[0].typed_question
                                                                                    },
                                                                                    {
                                                                                        _id: 'video',
                                                                                        count: totalQuestions[0].video_question
                                                                                    }
                                                                                ],
                                                                                resentAddedQuestions: recentQuestions
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        } else {
            self.questionsSchemaModel.aggregate([{
                $match: {'emp_id': req.params.emp_id}
            }, {
                $group: {
                    _id: "$subject.name",
                    count: {$sum: 1}
                }
            }], function (err, res) {
                if (err) {
                    callback(err, null)
                } else {
                    self.questionsSchemaModel.aggregate([{
                        $match: {'emp_id': req.params.emp_id}
                    }, {
                        $group: {
                            _id: "$questiontype",
                            count: {$sum: 1}
                        }
                    }], function (err, data) {
                        if (err) {
                            callback(err, null)
                        } else {
                            self.questionsSchemaModel.count({"emp_id": req.params.emp_id}, function (err, questionsCount) {
                                if (err) {
                                    callback(err, null)
                                } else {
                                    self.questionsSchemaModel.find({}, function (err, recentQuestions) {
                                        var resentAddedQuestions = [];
                                        if (err) {
                                            callback(err, null)
                                        } else {
                                            for (var i = 0; i < recentQuestions.length; i++) {
                                                resentAddedQuestions.push({
                                                    name: recentQuestions[i].subject.name,
                                                    lastmoddatetime: recentQuestions[i].lastmoddatetime,
                                                    Source: recentQuestions[i].questiontype,
                                                    question: recentQuestions[i].question
                                                });
                                            }
                                            callback(null, {
                                                questionsCount: questionsCount,
                                                questionsOnSubjects: res,
                                                quesOnQuizzes: data,
                                                resentAddedQuestions: resentAddedQuestions
                                            });
                                        }
                                    }).sort({lastmoddatetime: -1}).limit(5);

                                }

                            });
                        }
                    })
                }
            });
        }
    } else {
        self.questionsSchemaModel.count({"emp_id": req.decoded._id}, function (err, questionsCount) {
            callback(err, {questionsCount: questionsCount});
        });
    }

};

module.exports = EmployeeQuestionsModel;



