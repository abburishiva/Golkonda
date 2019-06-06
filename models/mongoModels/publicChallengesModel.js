var _ = require('lodash'),
    async = require('async'),
    getSchema = require('../schemas/publicChallengesSchema.js'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    publicChallengesSchema = new Schema(getSchema),
    PublicChallengesSchemaModel = mongoose.model('publicChallenges', publicChallengesSchema, 'publicChallenges'),
    OrganizationModel = require('../organizationsModel'), om;

function PublicChallengesModel() {
    this.PublicChallengesSchemaModel = PublicChallengesSchemaModel;
    this.modelType = 'mongo';
    om = new OrganizationModel();
}

PublicChallengesModel.prototype.find = function (params, callback) {
    var self = this;
    if (params.source && params.source['subject.id']) {
        params.source['subject.id'] = {$in: [params.source['subject.id']]};
    }
    self.PublicChallengesSchemaModel.find(params.source, function (err, data) {
        callback(err, data)
    }).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};

PublicChallengesModel.prototype.findOne = function (params, id, callback) {
    this.PublicChallengesSchemaModel.findOne({_id: id}, callback);
};

PublicChallengesModel.prototype.create = function (data, callback) {
    var self = this;
    if (data && data.challengeid) {
        var EmployerInterviewModel = mongoose.model('employerInterviews');
        EmployerInterviewModel.findOne({"_id": data.challengeid}, function (err, challengeData) {
            if (!challengeData) {
                return callback(err, {message: 'No Record Found To Create Challenge'});
            }
            challengeData = challengeData.toObject();
            challengeData.candidate_id = data.candidate_id;
            self.PublicChallengesSchemaModel.create(publicChallengeFunction(challengeData), callback);
        });

    } else {
        callback({"status": 400, "message": "bad request"});
    }
};
PublicChallengesModel.prototype.update = function (id, data, callback) {
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    update['challengeCompletedDatetime'] = new Date().toISOString();
    self.PublicChallengesSchemaModel.update(conditions, update, options, function (err, res) {

        callback(err, res);
    });
};
PublicChallengesModel.prototype.remove = function (id, callback) {
    this.PublicChallengesSchemaModel.remove({_id: id}, callback);
};
PublicChallengesModel.prototype.findPublicChallengesCount = function (data, callback) {
    var self = this;
    self.PublicChallengesSchemaModel.count({}, function (err, publicChallenges) {
        callback(err, {publicChallenges: publicChallenges});
    });
};
PublicChallengesModel.prototype.findPublicChallengesSkillsCount = function (params, callback) {
    var self = this;
    self.PublicChallengesSchemaModel.aggregate([
        {$unwind: "$quiz.name"}, {
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
        self.PublicChallengesSchemaModel.count({}, function (err, quizCount) {
            callback(err, {quizCount: quizCount, allQuizesCount: allQuizesCount});
        });
    });
};
PublicChallengesModel.prototype.findChallengesidCount = function (params, callback) {
    var self = this, subName = [];

    self.PublicChallengesSchemaModel.aggregate([
        {$match: {"candidate_id": params.decoded._id}},
        {$unwind: "$subject.name"}, {
            $group: {
                _id: "$subject.name",
                count: {$sum: 1}
            }
        }], function (err, allQuizesCount) {
        allQuizesCount = allQuizesCount.map(function (value) {
            subName.push(value);
            return {
                label: value._id,
                value: value.count
            };
        });
        self.PublicChallengesSchemaModel.count({"candidate_id": params.decoded._id}, function (err, quizCount) {
            callback(err, {
                ChallengesidCount: quizCount,
                ChallengesidSkillCount: _.orderBy(subName, ['count'], ['desc']).slice(0, 5)
            });
        });
    });
};
PublicChallengesModel.prototype.getAllRecentaddChallengesCount = function (params, callback) {
    var self = this, data = [];
    om.getAllName(params.params, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            self.PublicChallengesSchemaModel.find({}, function (err, res) {
                for (var i in res) {
                    for (var j in result) {
                        if (result[j].name === res[i].interviewDetail.positionDetails.company.name) {
                            data.push({
                                companyLogo: result[j].logo,
                                subName: res[i].interviewDetail.positionDetails.position,
                                lastmoddatetime: res[i].lastmoddatetime
                            })
                        }
                    }
                }
                callback(err, data)
            }).sort({lastmoddatetime: -1}).limit(5);
        }
    })
};
PublicChallengesModel.prototype.getCompletedPublicChallengesCount = function (data, callback) {
    var self = this;
    self.PublicChallengesSchemaModel.count({
        "candidate_id": data.decoded._id,
        "interviewDetail.access.public": true,
        "challengeCompletedDatetime": {$exists: true}
    }, function (err, res) {
        callback(err, {count: res});
    });
};

function publicChallengeFunction(data) {
    var questions = [], types = [], totalTime = 0;
    async.eachOf(data.questions.list, function (item, key) {
        if (typeof item.time === 'number') {
            totalTime += item.time;
        } else if (item.time) {
            totalTime += parseInt(item.time, 10);
        } else if (!item.time) {
            item.time = 60;
            totalTime += item.time;
        }
        if (item.questiontype.toLowerCase() === 'choice') {
            questions.push({
                rowNo: key,
                question_id: item._id,
                question: item.question,
                subjectId: item.subjectid,
                questiontype: item.questiontype,
                answerOne: item.choice1,
                answerTwo: item.choice2,
                answerThree: item.choice3,
                answerFour: item.choice4,
                answerFive: item.choice5,
                answerSix: item.choice6,
                originalAnswer: item.answer,
                explanation: item.explanation,
                time: item.time,
                preparetime: item.preparetime,
                candidateAnswer: null,
                time_taken: 0,
                attempted: "N",
                correctOrNot: 'N'
            });
        } else if (item.questiontype.toLowerCase() === 'coding') {
            questions.push({
                rowNo: key,
                question_id: item._id,
                questiontype: item.questiontype,
                subjectId: item.subjectid,
                question: item.question,
                template: item.template,
                time: item.time,
                preparetime: item.preparetime,
                hint: item.hint,
                testcases: item.testcases,
                originalAnswer: item.answer,
                candidateAnswer: null,
                attempted: "N",
                error: null,
                time_taken: 0
            });
        } else if (item.questiontype.toLowerCase() === 'video') {
            data.isVideo = true;
            questions.push({
                rowNo: key,
                question_id: item._id,
                subjectId: item.subjectid,
                question: item.question,
                questiontype: item.questiontype,
                time: item.time,
                preparetime: item.preparetime,
                attempted: "N",
                time_taken: 0
            });
        } else if (item.questiontype.toLowerCase() === 'audio') {
            data.isAudio = true;
            questions.push({
                rowNo: key,
                question_id: item._id,
                subjectId: item.subjectid,
                question: item.question,
                questiontype: item.questiontype,
                time: item.time,
                preparetime: item.preparetime,
                attempted: "N",
                time_taken: 0
            });
        } else if (item.questiontype.toLowerCase() === 'typed') {
            questions.push({
                rowNo: key,
                question_id: item._id,
                subjectId: item.subjectid,
                question: item.question,
                questiontype: item.questiontype,
                time: item.time,
                preparetime: item.preparetime,
                attempted: "N",
                time_taken: 0
            });
        }
    });
    var quiz = {
        level: {
            id: data.detail.level.id,
            name: data.detail.level.name
        },
        quiz: {
            limit: data.detail.limit,
            totaltime: data.detail.totaltime,
            name: data.detail.types,
            makeChallenge: data.detail.makeChallenge
        },
        subject: data.subject,
        candidate_id: data.candidate_id,
        questions_size: questions.length,
        questions: questions,
        total_time: totalTime,
        lastmoddatetime: data.lastmoddatetime,
        lastmoduserid: data.lastmoduserid,
        isVideo: data.isVideo,
        isAudio: data.isAudio,
        interviewDetail: {
            rescheduled: data.rescheduled,
            rescheduledConfirm: data.rescheduledConfirm,
            definitionId: data._id,
            interviewId: data.interviewId,
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
                public: data.access.public
            },
            positionDetails: {
                experience: data.positionDetails.experience,
                company: {
                    name: data.positionDetails.company.name,
                    location: data.positionDetails.company.location,
                    phone: data.positionDetails.company.phone
                },
                position: data.positionDetails.position,
                positionType: data.positionDetails.positionType,
                noOfPositions: data.positionDetails.noOfPositions,
                description: data.positionDetails.description,
                skills: data.positionDetails.skills
            },
            events: data.events
        }
    };
    return quiz;
}

module.exports = PublicChallengesModel;
