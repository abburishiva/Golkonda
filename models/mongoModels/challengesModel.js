var async = require('async'),
    mongoose = require('mongoose'),
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/challengesSchema.js'),
    PublicChallengesModel = require('./publicChallengesModel.js'),
    _ = require("lodash"),
    publicChallengesModel,
    Schema = mongoose.Schema,
    challengesSchema = new Schema(getSchema),
    quizSchema = mongoose.model('challenges', challengesSchema),
    createChallenges,
    log;

function ChallengesModel() {
    this.modelType = 'mongo';
    this.quizSchemaModel = quizSchema;
    publicChallengesModel = new PublicChallengesModel();
    log = new Logger();
}

ChallengesModel.prototype.find = function (params, callback) {
    log.info('info at find method of challenge model in mongo models');
    if (params && params.source.candidate_id && params.source.isPublic) {
        if (params.source.candidate_id !== 'undefined' && params.source.candidate_id !== 'null') {
            params.source['challengeCompletedDatetime'] = {$exists: true};
            delete params.source.isPublic;
            publicChallengesModel.find(params, callback);
        } else {
            callback(null, {"status": 400, "message": "bad request"});
        }
    } else {
        this.quizSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
        log.info('successfully callback the data of find method of challenge model in mongo models');
    }
};
ChallengesModel.prototype.findOne = function (params, id, callback) {
    log.info('info at ChallengesModel findOne method of challenge model in mongo models to employer');
    if (params.source && params.source['interviewDetail.definitionId']) {
        this.quizSchemaModel.findOne(params.source, function (err, results) {
            callback(err, results);
        });
    } else if (params.source && params.source.isPublic) {
        publicChallengesModel.findOne(params, id, function (err, results) {
            callback(err, results);
        });
    } else {
        this.quizSchemaModel.findOne({_id: id}, callback);
    }
    log.info('successfully callback the data of findOne method of challenge model in mongo models to employer');
};
ChallengesModel.prototype.create = function (data, callback) {
    log.info('info at create method of challenge model in mongo models');
    var self = this;
    if (data && data.public && data.challengeid) {
        var EmployerInterviewModel = mongoose.model('employerInterviews');
        EmployerInterviewModel.findOne({"_id": data.challengeid}, function (err, challengeData) {
            if (!challengeData) {
                return callback(err, {message: "No Record Found To Create Challenge"});
            }
            challengeData = challengeData.toObject();
            challengeData.candidate_id = data.candidate_id;
            publicChallengesModel.create(data, function (err, res) {
                callback(err, res);
            });
        });
    } else {
        self.quizSchemaModel.create(createChallenges(data), callback);
    }
    log.info('successfully created one record of challenge model in mongo models');
};
ChallengesModel.prototype.update = function (id, data, callback) {
    log.info('info at update method of challenge model in mongo models');
    if (data && data.isInterviewCompleted) {
        publicChallengesModel.update(id, data, function (err, res) {
            callback(err, res);
        });
    } else {
        var conditions = {_id: id}, update = data, options = {multi: true};
        this.quizSchemaModel.update(conditions, update, options, callback);
        log.info('successfully challenge one record of challenge model in mongo models');
    }
};
ChallengesModel.prototype.remove = function (id, callback) {
    log.info('info at remove method of challenge model in mongo models');
    this.quizSchemaModel.remove({_id: id}, callback);
    log.info('successfully remove one record of challenge model in mongo models');
};
ChallengesModel.prototype.search = function (params, callback) {
    log.info('info at search method of challenge model in mongo models');
    this.quizSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
    log.info('successfully callback the data of search method of challenge model in mongo models');
};
ChallengesModel.prototype.findChallengesCount = function (challengesCount, callback) {
    var self = this;

    self.quizSchemaModel.aggregate([{$unwind: "$quiz.name"}, {
        $group: {
            _id: "$quiz.name",
            count: {$sum: 1}
        }
    }], function (err, allQuizesCount) {
        allQuizesCount = allQuizesCount.map(function (value) {
            return {
                label: value._id,
                value: value.count
            };
        });
        self.quizSchemaModel.count({}, function (err, quizCount) {
            callback(err, {quizCount: quizCount, allQuizesCount: allQuizesCount});
        });
    });
};
ChallengesModel.prototype.findQuizzesCount = function (params, callback) {
    var self = this;
    self.quizSchemaModel.aggregate([{$match: {"candidate_id": params.decoded._id}}, {$unwind: "$quiz.name"}, {
        $group: {
            _id: "$quiz.name",
            count: {$sum: 1}
        }
    }], function (err, allQuizesCount) {
        allQuizesCount = allQuizesCount.map(function (value) {
            return {
                label: value._id,
                value: value.count
            };
        });
        self.quizSchemaModel.count({"candidate_id": params.decoded._id}, function (err, quizCount) {
            callback(err, {quizCount: quizCount, allQuizesCount: allQuizesCount});
        });
    });
};
ChallengesModel.prototype.findCompletedQuizzesCount = function (data, callback) {
    var self = this;
    self.quizSchemaModel.count({"candidate_id": data.decoded._id}, function (err, res) {
        callback(err, {count: res});
    });
};
ChallengesModel.prototype.getARecentChallengesCount = function (params, callback) {
    var self = this, data = [];
    self.quizSchemaModel.find({"candidate_id": params.decoded._id}, function (err, res) {
        for (var i in res) {
            data.push({challengeType:res[i].quiz.name  , subName:res[i].subject.name,challengedatetime : res[i].challengedatetime, _id : res[i]._id})
        }
        callback(err,data)
    }).sort({challengedatetime: -1}).limit(5);
};
ChallengesModel.prototype.getAWeekChallengesCount = function (data, callback) {
    var self = this, myDate = new Date(), newDate, oldDate, dates = [];
    for (var i = 7; i > 0; i--) {
        (function (i) {
            newDate = new Date(myDate.getTime() - (60 * 60 * 24 * i * 1000)).toISOString();
            oldDate = new Date(myDate.getTime() - (60 * 60 * 24 * (i - 1) * 1000)).toISOString();
            dates.push({date: newDate, val: i});
            self.quizSchemaModel.count({
                "candidate_id": data.decoded._id,
                "challengedatetime": {$gte: newDate, $lt: oldDate}
            }, function (err, res) {
                if (res >= 0) {
                    dates.forEach(function (v, k) {
                        if (v.val === i) {
                            dates[k].count = res;
                            delete dates[k].val;
                        }
                    });
                    if (i === 1) {
                        callback(err, {challenges: dates});
                    }
                }
            });
        })(i)
    }
};

createChallenges = function (data) {
    var quiz, source,
        interviewDetail, quizObj,
        levelObj, subjectObj, questions = [],
        totalTime = 0;
    if (data.access && data.access.public === true) {
        source = data.questions.list;
        subjectObj = {
            id: data.subject.id,
            name: data.subject.name,
            icon_class: data.subject.icon_class,
            type: data.subject.type
        };
        quizObj = {
            name: data.detail.types,
            quizName: data.detail.name,
            makeChallenge: data.detail.makeChallenge
        };
        levelObj = {
            id: data.detail.level.id,
            name: data.detail.level.name
        };
        interviewDetail = {
            definitionId: data._id,
            interviewerEmail: data.email,
            emp_id: data.emp_id,
            interviewerName: data.name,
            interviewName: data.interviewName,
            interviewType: data.type,
            source: data.questions.source,
            type: data.questions.type,
            access: {
                live: data.access.live,
                collaboration: data.access.collaboration,
                collabarateId: data.access.collabarateId,
                screenSharing: data.access.screenSharing,
                screen_sharing_id: data.access.screen_sharing_id,
                public: data.access.public
            },
            positionDetails: {
                experience: data.positionDetails.experience,
                description: data.positionDetails.description,
                company: {
                    name: data.positionDetails.company.name,
                    location: data.positionDetails.company.location,
                    phone: data.positionDetails.company.phone
                },
                position: data.positionDetails.position,
                positionType: data.positionDetails.positionType,
                noOfPositions: data.positionDetails.noOfPositions,
                skills: data.positionDetails.skills
            },
            notifications: {
                type: data.notifications.type,
                events: data.notifications.events
            }
        };
    } else {
        source = data.source;
        levelObj = {
            id: source[0]['common_level__id'],
            name: source[0]['common_level__name']
        };
        subjectObj = {
            id: source[0]['subject__id'],
            name: source[0]['subject__name'],
            icon: source[0]['subject__icon_class']
        };
        quizObj = {
            id: data.quizTypeId,
            name: data.quizTypeName
        };
    }
    async.eachOf(source, function (value, key) {
        if (typeof value.time === 'number') {
            totalTime += value.time;
        } else if (value.time) {
            totalTime += parseInt(value.time, 10);
        } else if (!value.time) {
            value.time = 60;
            totalTime += value.time;
        }
        if ((data.quizTypeName && data.quizTypeName.toLowerCase() === 'choice') || (value.questiontype && value.questiontype.toLowerCase() === 'choice')) {
            questions.push({
                rowNo: key,
                preparetime: value.preparetime,
                question_id: value.id,
                question: value.question,
                questiontype: value.questiontype,
                answerOne: value.choice1,
                answerTwo: value.choice2,
                answerThree: value.choice3,
                answerFour: value.choice4,
                originalAnswer: value.answer,
                explanation: value.explanation,
                time: value.time,
                candidateAnswer: null,
                attempted: "N",
                correctOrNot: 'N',
                time_taken: 0
            });
        } else if ((data.quizTypeName && data.quizTypeName.toLowerCase() === 'coding') || (value.questiontype && value.questiontype.toLowerCase() === 'coding')) {
            questions.push({
                rowNo: key,
                question_id: value.id,
                preparetime: value.preparetime,
                question: value.question,
                questiontype: value.questiontype,
                template: value.template,
                testcases: value.testcases,
                originalAnswer: value.answer,
                reviewDone: value.reviewDone,
                testCasesRequired: value.testCasesRequired,
                compilationRequired: value.compilationRequired,
                time: value.time,
                hint: value.hint,
                candidateAnswer: null,
                attempted: "N",
                error: null,
                time_taken: 0
            });
        } else if (((data.quizTypeName && data.quizTypeName === 'video') || (value.questiontype && value.questiontype.toLowerCase() === 'video'))) {
            questions.push({
                rowNo: key,
                question_id: value.id,
                preparetime: value.preparetime,
                questiontype: value.questiontype,
                question: value.question,
                time: value.time,
                attempted: "N",
                time_taken: 0
            });
        } else if (((data.quizTypeName && data.quizTypeName === 'audio') || (value.questiontype && value.questiontype.toLowerCase() === 'audio'))) {
            questions.push({
                rowNo: key,
                question_id: value.id,
                preparetime: value.preparetime,
                questiontype: value.questiontype,
                question: value.question,
                time: value.time,
                attempted: "N",
                candidateAnswer: null,
                time_taken: 0
            });
        } else if (((data.quizTypeName && data.quizTypeName === 'whiteboard') || (value.questiontype && value.questiontype.toLowerCase() === 'whiteboard'))) {
            questions.push({
                rowNo: key,
                question_id: value.id,
                question: value.question,
                questiontype: value.questiontype,
                preparetime: value.preparetime,
                time: value.time,
                attempted: "N",
                time_taken: 0
            });
        } else if (((data.quizTypeName && data.quizTypeName === 'typed') || (value.questiontype && value.questiontype.toLowerCase() === 'typed'))) {
            questions.push({
                rowNo: key,
                question_id: value.id,
                preparetime: value.preparetime,
                questiontype: value.questiontype,
                question: value.question,
                time: value.time,
                answer: null,
                attempted: "N",
                time_taken: 0
            });
        }
    });
    quiz = {
        level: levelObj,
        quiz: quizObj,
        subject: subjectObj,
        interviewDetail: interviewDetail,
        candidate_id: data.candidate_id,
        questions: questions,
        total_time: totalTime,
        lastmoddatetime: data.lastmoddatetime,
        lastmoduserid: data.lastmoduserid,
        email: data.candidateEmail,
        challengedatetime: new Date().toGMTString()
    };
    return quiz;
};

module.exports = ChallengesModel;