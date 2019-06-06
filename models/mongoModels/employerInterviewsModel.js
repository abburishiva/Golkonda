var Logger = require('../../utils/winston/logModule'),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    getSchema = require('../schemas/employerInterviewSchema.js'),
    utils = require('../../utils/params/modelParameters'),
    PublicChallengesModel = require('./publicChallengesModel.js'),
    Autocomplete = require('autocomplete-trie'),
    EmployerInterviewSchema = new Schema(getSchema),
    InterviewSchemaModel = mongoose.model('employerInterviews', EmployerInterviewSchema, 'employerInterviews'),
    publicChallengesModel,
    log, auto, result;

function EmployerInterviewsModel() {
    this.interviewSchemaModel = InterviewSchemaModel;
    publicChallengesModel = new PublicChallengesModel();
    log = new Logger();
    this.modelType = 'mongo';
}

EmployerInterviewsModel.prototype.find = function (params, callback) {
    var self = this, position = [], positionDetail = [], employerPositionDetails = [];
    log.info('info at EmployerInterviewsModel findAll and params');
    if (params && params.source && params.source._id) {
        self.interviewSchemaModel.find({"emp_id": params.source._id}, function (err, positionDetails) {
            if(positionDetails && positionDetails.length>0) {
                positionDetails.forEach(function (val) {
                    if (val && val.positionDetails && val.positionDetails.position) {
                        position.push(val.positionDetails.position.toLowerCase());
                        positionDetail.push(val.positionDetails);
                    }
                });
            }else {
                callback(err, {status: 400, message: 'Please provide valid employer id'});
            }
            if (params && params.source && params.source.q && params.source.q.toLowerCase() === "all") {
                callback(err,position);
            } else if (params && params.source && params.source.q && params.source.q.toLowerCase().length > 0) {
                auto = new Autocomplete(position);
                result = auto.search(params.source.q.toLowerCase());
                positionDetail.forEach(function(val){
                    result.forEach(function(res){
                        if(val && val.position && val.position.toLowerCase() === res){
                            employerPositionDetails.push(val)
                        }
                    })
                })
                callback(err,employerPositionDetails)
            } else {
                callback(err, {status: 400, message: 'Bad request'});
            }
        })
    } else if (params && params.source && params.source.candidate_id && JSON.parse(params.source['access.public'])) {
        if (params.source.candidate_id !== 'undefined' && params.source.candidate_id !== 'null') {
            var ChallengesModel = mongoose.model('publicChallenges'),
                candidateId = params.source.candidate_id;
            delete params.source.candidate_id;
            self.interviewSchemaModel.find(params.source, function (err, publicChallenges) {
                if (publicChallenges && publicChallenges.length > 0) {
                    var queryParams = {
                        "source": {
                            'candidate_id': candidateId,
                            'interviewDetail.definitionId': {$exists: true}
                        }
                    };
                    publicChallengesModel.find(queryParams, function (err, candidateChallenges) {
                        self.publicChallenges(candidateId, publicChallenges, candidateChallenges, callback);
                    });
                } else {
                    callback(null, publicChallenges);
                }
            }).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
        } else {
            callback(null, {"status": 400, "message": "bad request"});
        }
    } else {
        log.info('info at find method of EmployeeChallenges Model in mongo models');
        self.interviewSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
    }
};
EmployerInterviewsModel.prototype.publicChallenges = function (candidateId, empChallenges, candidateChallenges, callback) {
    callback(null, _.filter(empChallenges, _.conforms({
        "_id": function (n) {
            return _.map(candidateChallenges, 'interviewDetail.definitionId').indexOf(String(n)) < 0;
        }
    })));
};

EmployerInterviewsModel.prototype.findOne = function (params, id, callback) {
    log.info('info at EmployerInterviewsModel findOne and params');
    this.interviewSchemaModel.findOne({_id: id}, callback);
};
EmployerInterviewsModel.prototype.create = function (data, callback) {
    log.info('info at EmployerInterviewsModel create and params');
    this.interviewSchemaModel.create(data, callback);
};
EmployerInterviewsModel.prototype.update = function (id, data, callback) {
    var self = this;
    log.info('info at EmployerInterviewsModel update and params ');
    var conditions = {_id: id}, update = data, options = {multi: true};
    if (update && update.makeChallenge && update.makeChallenge.toLowerCase() === "static") {
        self.findOne({}, id, function (err, result) {
            if (result && result.detail.makeChallenge === update.makeChallenge) {
                if (update.list.length > 0) {
                    self.interviewSchemaModel.update(conditions, {"questions.list": update.list}, {multi: false}, callback);
                } else {
                    callback(null, {message: "Bad Request"});
                }
            } else {
                callback(null, {message: "Bad Request"});
            }
        })
    } else {
        self.interviewSchemaModel.update(conditions, update, options, callback);
    }
};
EmployerInterviewsModel.prototype.remove = function (id, callback) {
    log.info('info at EmployerInterviewsModel update and params are');
    this.interviewSchemaModel.remove({_id: id}, callback);
};

EmployerInterviewsModel.prototype.findInterviewsCount = function (params, callback) {
    var self = this;

    self.interviewSchemaModel.aggregate([{$unwind: "$positionDetails.skills"}, {$project: {"positionDetails.skills.text": {$toLower: "$positionDetails.skills.text"}}}, {
        $group: {
            _id: "$positionDetails.skills.text",
            count: {$sum: 1}
        }
    }], function (err, data) {
        var value = data.map(function (value) {
            return {
                label: value._id,
                value: value.count
            };
        });
        self.interviewSchemaModel.count({}, function (err, interviews) {
            callback(err, {interviews: interviews, totalSkills: _.uniqWith(value, _.isEqual)});
        });
    });
};

EmployerInterviewsModel.prototype.findEmpInterviewsCount = function (params, callback) {
    var self = this, popularQuestions = [], obj, c = 0, p = Promise, subName, isPublic = false, sharedChallenges = {},
        isInterviews;
    if (params && params.name === 'library') {
        self.interviewSchemaModel.aggregate([{
            $unwind: "$questions.list"
        },
            {
                $group: {
                    _id: "$questions.list.question",
                    count: {$sum: 1}
                }
            }, {$sort: {count: -1}}, {$limit: 4}
        ], function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                return new p(function (resolve, reject) {
                    data.map(function (val, k) {
                        self.interviewSchemaModel.find({"questions.list.question": data[k]._id}, function (err, d) {
                            if (err) {
                                reject(err);
                            } else {
                                for (var i = 0; i < d[0].questions.list.length; i++) {
                                    if (d[0].questions.list[i].question === data[k]._id) {
                                        for (var l = 0; l < d[0].subject.length; l++) {
                                            if (d[0].questions.list[i].subjectid === d[0].subject[l].id) {
                                                obj = {
                                                    "subject": d[0].subject[l].name,
                                                    "questionType": d[0].questions.list[i].questiontype,
                                                    "question": d[0].questions.list[i].question,
                                                    "date": d[0].lastmoddatetime
                                                }
                                            }
                                        }
                                        popularQuestions.push(obj);
                                        c++;
                                        if (c === 4) {
                                            resolve(popularQuestions);
                                        }
                                    }
                                }
                            }

                        }).sort({lastmoddatetime: -1})
                    })
                }).then(function (value) {
                    callback(null, {popularQuestions: value})
                }).catch(function (reason) {
                    callback(reason, null)
                })
            }
        });
    } else if (params && params.params && params.params.name === 'interviews') {
        for (var i = 0; i < 2; i++) {
            if (!isPublic) {
                isPublic = true;
                isInterviews = false;
                getData(function (result) {
                    sharedChallenges.latestSharedInterviews = result;
                });
            } else {
                isInterviews = true;
                getData(function (result) {
                    sharedChallenges.latestSharedPublic = result;
                    self.interviewSchemaModel.count({"emp_id": params.decoded._id}, function (err, interviewCount) {
                        if (err) {
                            callback(err, null);
                        } else {
                            self.interviewSchemaModel.count({$and: [{'emp_id': params.decoded._id}, {'access.public': true}]}, function (err, interviews) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    callback(null, {
                                        employeeInterviewsCount: interviewCount,
                                        totalInterviews: interviewCount - interviews,
                                        totalPublicInterviews: interviews,
                                        latestSharedPublicChallenges: sharedChallenges.latestSharedPublic,
                                        latestSharedInterviews: sharedChallenges.latestSharedInterviews
                                    });
                                }
                            });
                        }
                    });
                });
            }
        }

        function getData(response) {
            self.interviewSchemaModel.find({$and: [{'emp_id': params.decoded._id}, {'access.public': isInterviews}, {$where: 'this.sendEmail.length > 0'}]}, function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    response(res);
                }
            }).sort({'lastmoddatetime': -1}).limit(5);
        }
    } else {
        self.interviewSchemaModel.count({"emp_id": params.decoded._id}, function (err, interviewCount) {
            callback(err, {employeeInterviewsCount: interviewCount});
        });
    }
};

module.exports = EmployerInterviewsModel;
