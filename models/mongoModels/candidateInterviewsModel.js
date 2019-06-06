var EmailEngineModel = require('../mysqlModels/emailEngineModel'),
    NotificationEngineModel = require('../mysqlModels/notificationEngineModel'),
    FirebaseNotificationModel = require('../firebaseNotificationModel'),
    getSchema = require('../schemas/candidateInterviewsSchema.js'),
    SubjectModel = require('../mysqlModels/subjectModel'),
    utils = require('../../utils/params/modelParameters'),
    Logger = require('../../utils/winston/logModule'),
    config = require('../../config/config.json'),
    OrganizationModel = require('../organizationsModel'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    zone = require('moment-timezone'),
    async = require('async'),
    datetime = require('node-datetime'),
    Schema = mongoose.Schema,
    candidateInterviewsSchema = new Schema(getSchema),
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    candidateInterviewsSchemaModel = mongoose.model('candidateInterviews', candidateInterviewsSchema, 'candidateInterviews'),
    notificationEngineModel,
    firebaseNotificationModel,
    emailEngineModel,
    subject,
    createInterview,
    om,
    log;

function CandidateInterviewsModel() {
    this.modelType = 'mongo';
    this.modelData = 'interviews';
    this.candidateInterviews = candidateInterviewsSchemaModel;
    notificationEngineModel = new NotificationEngineModel();
    firebaseNotificationModel = new FirebaseNotificationModel();
    emailEngineModel = new EmailEngineModel();
    om = new OrganizationModel();
    subject = new SubjectModel();
    log = new Logger();
}
function sendMail(templateData) {
    emailEngineModel.sendMessage(templateData, function () {
        return undefined;
    });
}
function sendNotification(pushData) {
    notificationEngineModel.sendPush(pushData, function () {
        return undefined;
    });
}
function calculateTime(offset) {
    var utc = moment.utc().valueOf(),
        nowDate = moment.utc(utc).toDate(),
        utcDate = nowDate.getTime() + (nowDate.getTimezoneOffset() * 60000),
        finalDate = new Date(utcDate + (-60000 * offset));
    return finalDate.toLocaleString('en-GB');
}

CandidateInterviewsModel.prototype.find = function (params, callback) {
    log.info('info at CandidateInterviewsModel find method and params');
    var interviewsParams = {}, self = this;
    if (params.source) {
        if (params.source.emp_id) {
            interviewsParams['interviewDetail.emp_id'] = params.source.emp_id;
        } else if (params.source.candidate_id) {
            interviewsParams.email = params.source.email;
        }
        if (params.source['interviewDetail.interviewId']) {
            interviewsParams['interviewDetail.interviewId'] = params.source['interviewDetail.interviewId'];
        }
        if (params.source['interviewDetail.definitionId']) {
            interviewsParams['interviewDetail.definitionId'] = params.source['interviewDetail.definitionId']
        }
    }
    self.candidateInterviews.find(interviewsParams, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
    log.info('info at CandidateInterviewsModel find method and send results');
};

CandidateInterviewsModel.prototype.getDistinct = function (params, results, callback) {
    log.info('info at CandidateInterviewsModel getDistinct method and params, results ');
    if (params.source.status && (params.source.status.toLowerCase() !== 'upcoming' && params.source.status.toLowerCase() !== 'expired' && params.source.status.toLowerCase() !== 'completed')) {
        return callback({message: 'Bad request'});
    }
    var interviewsArray = [],
        item, completedMonth,
        localZone,
        expiredate,
        clientZone = params.source.zone;
    async.each(results, function (obj) {
        item = params.isCache ? obj : obj.toObject();
        if (item.interviewDetail.interviewStartDateTime && item.interviewDetail.interviewExpiredDateTime) {
            var allowTime = (item.interviewDetail.allowTime) ? (item.interviewDetail.allowTime) : 0,
                latencyTime = new Date(Date.parse(item.interviewDetail.interviewStartDateTime)).getTime() + (allowTime * 60000),
                expireWithAllowTime = new Date(latencyTime),
                clientInterviewStartTime = zone.tz(new Date(Date.parse(item.interviewDetail.interviewStartDateTime)), clientZone).format("DD/MM/YYYY HH:mm:ss").split(' '),
                clientInterviewExpiredTime = zone.tz(new Date(Date.parse(item.interviewDetail.interviewExpiredDateTime)), clientZone).format("DD/MM/YYYY HH:mm:ss").split(' '),
                splitMonth = zone.tz(new Date(Date.parse(item.challengeCreatedDatetime)), clientZone).format("DD/MM/YYYY HH:mm:ss").split(' ');
            item['localStartDateTime'] = months[clientInterviewStartTime[0].split('/')[1] - 1].concat(' ', clientInterviewStartTime[0].split('/')[0]).concat(',', clientInterviewStartTime[0].split('/')[2]).concat(' ').concat(clientInterviewStartTime[1]);
            item['localExpiredDateTime'] = months[clientInterviewExpiredTime[0].split('/')[1] - 1].concat(' ', clientInterviewExpiredTime[0].split('/')[0]).concat(',', clientInterviewExpiredTime[0].split('/')[2]).concat(' ').concat(clientInterviewExpiredTime[1]);
            item['challengeCreatedInLocal'] = months[splitMonth[0].split('/')[1] - 1].concat(' ', splitMonth[0].split('/')[0]).concat(',', splitMonth[0].split('/')[2]).concat(' ').concat(splitMonth[1]);
            expiredate = (item.interviewDetail.allowTime) ? expireWithAllowTime : new Date(Date.parse(item.interviewDetail.interviewExpiredDateTime));
            localZone = (item.interviewDetail.allowTime) ? (zone.tz(expireWithAllowTime, clientZone).format("DD/MM/YYYY HH:mm:ss")) : clientInterviewExpiredTime;
            if (params.source.status && params.source.status.toLowerCase() === 'upcoming' && !item.candidate_id && expiredate > new Date()) {
                log.info('info at CandidateInterviewsModel getDistinct method and upcoming results ');
                var todayLocalTime = datetime.create(calculateTime(parseInt(params.source.offset))).format('d/m/y H:M:S'),
                    ms = moment(localZone, "DD/MM/YYYY HH:mm:ss").diff(moment(todayLocalTime, "DD/MM/YYYY HH:mm:ss")),
                    startAt = moment(clientInterviewStartTime, "DD/MM/YYYY HH:mm:ss").diff(moment(todayLocalTime, "DD/MM/YYYY HH:mm:ss"));
                item['allowedTime'] = moment.duration(ms)._data.days + 'd:' + moment.duration(ms)._data.hours + 'h:' + moment.duration(ms)._data.minutes + 'm:' + moment.duration(ms)._data.seconds + 's';
                item['timeLeft'] = moment.duration(startAt)._data.days + 'd:' + moment.duration(startAt)._data.hours + 'h:' + moment.duration(startAt)._data.minutes + 'm:' + moment.duration(startAt)._data.seconds + 's';
                if (params.source["interviewDetail.interviewId"] && params.source["interviewDetail.interviewId"] === item.interviewDetail.interviewId) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail.definitionId"] && params.source["interviewDetail.definitionId"] === item.interviewDetail.definitionId) {
                    interviewsArray.push(item);
                } else if (params.source["subject.name"] && params.source["subject.name"] === item.subject.name) {
                    interviewsArray.push(item);
                } else if (params.source["level.name"] && params.source["level.name"] === item.level.name) {
                    interviewsArray.push(item);
                } else if (params.source["quiz.name"] && params.source["quiz.name"] === item.quiz.name) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail.interviewerName"] && params.source["interviewDetail.interviewerName"] === item.interviewDetail.interviewerName) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail['positionDetails.company']"] && params.source["interviewDetail['positionDetails.company']"] === item.interviewDetail['positionDetails.company']) {
                    interviewsArray.push(item);
                } else {
                    interviewsArray.push(item);
                }
            } else if (params.source.status && params.source.status.toLowerCase() === 'expired' && !item.candidate_id && expiredate < new Date()) {
                if (params.source["interviewDetail.interviewId"] && params.source["interviewDetail.interviewId"] === item.interviewDetail.interviewId) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail.definitionId"] && params.source["interviewDetail.definitionId"] === item.interviewDetail.definitionId) {
                    interviewsArray.push(item);
                } else if (params.source["subject.name"] && params.source["subject.name"] === item.subject.name) {
                    interviewsArray.push(item);
                } else if (params.source["level.name"] && params.source["level.name"] === item.level.name) {
                    interviewsArray.push(item);
                } else if (params.source["quiz.name"] && params.source["quiz.name"] === item.quiz.name) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail.interviewerName"] && params.source["interviewDetail.interviewerName"] === item.interviewDetail.interviewerName) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail['positionDetails.company']"] && params.source["interviewDetail['positionDetails.company']"] === item.interviewDetail['positionDetails.company']) {
                    interviewsArray.push(item);
                } else {
                    interviewsArray.push(item);
                }
            } else if (params.source.status && params.source.status.toLowerCase() === 'completed' && item.candidate_id) {
                if (item.challengeCompletedDatetime) {
                    completedMonth = zone.tz(new Date(Date.parse(item.challengeCompletedDatetime)), clientZone).format("DD/MM/YYYY HH:mm:ss").split(' ');
                    item.challengeCompletedInLocal = months[completedMonth[0].split('/')[1] - 1].concat(' ', completedMonth[0].split('/')[0]).concat(',', completedMonth[0].split('/')[2]).concat(' ').concat(completedMonth[1]);
                }
                if (params.source["interviewDetail.interviewId"] && params.source["interviewDetail.interviewId"] === item.interviewDetail.interviewId) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail.definitionId"] && params.source["interviewDetail.definitionId"] === item.interviewDetail.definitionId) {
                    interviewsArray.push(item);
                } else if (params.source["subject.name"] && params.source["subject.name"] === item.subject.name) {
                    interviewsArray.push(item);
                } else if (params.source["level.name"] && params.source["level.name"] === item.level.name) {
                    interviewsArray.push(item);
                } else if (params.source["quiz.name"] && params.source["quiz.name"] === item.quiz.name) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail.interviewerName"] && params.source["interviewDetail.interviewerName"] === item.interviewDetail.interviewerName) {
                    interviewsArray.push(item);
                } else if (params.source["interviewDetail['positionDetails.company']"] && params.source["interviewDetail['positionDetails.company']"] === item.interviewDetail['positionDetails.company']) {
                    interviewsArray.push(item);
                } else {
                    interviewsArray.push(item);
                }
            }
        }
    });
    callback(null, interviewsArray);
};

CandidateInterviewsModel.prototype.findOne = function (params, id, callback) {
    var interviewsParams = {}, self = this;
    if (params.source) {
        interviewsParams._id = params.source._id;
        if (params.source.emp_id) {
            interviewsParams['interviewDetail.emp_id'] = params.source.emp_id;
        }
    }
    if (params.source.type && params.source.type.toLowerCase() === 'details') {
        self.candidateInterviews.findOne(interviewsParams, {'questions': 0}, function (err, results) {
            if (!results || err) {
                return callback(err, results);
            }
            return callback(null, self.getById(params, results));
        });
    } else {
        self.candidateInterviews.findOne(interviewsParams, function (err, results) {
            if (!results || err) {
                return callback(err, results);
            }
            return callback(null, self.getById(params, results));
        });
    }
};
CandidateInterviewsModel.prototype.getById = function (params, results) {
    var allowTime, expiredate, clientZone = params.source.zone;
    if (params.source.status && params.source.status.toLowerCase() === 'getinterview') {
        if ((params.source.email && params.source.email === results.email) || (params.source.type && params.source.type.toLowerCase() === 'details')) {
            allowTime = (results.interviewDetail.allowTime) ? results.interviewDetail.allowTime : 0;
            var interviewAllowedTime = new Date(Date.parse(results.interviewDetail.interviewStartDateTime)).getTime() + (allowTime * 60000),
                totalTimeforAllowed = new Date(interviewAllowedTime),
                clientInterviewStartTime = zone.tz(new Date(Date.parse(results.interviewDetail.interviewStartDateTime)), clientZone).format("LLLL");
            expiredate = results.interviewDetail.interviewExpiredDateTime;
            if (results.interviewDetail.allowTime) {
                expiredate = totalTimeforAllowed;
            }
            if (results.interviewDetail.interviewStartDateTime > new Date()) {
                var item = results.toObject(),
                    todayLocalTime = datetime.create(calculateTime(parseInt(params.source.offset))).format('d/m/y H:M:S'),
                    startTime = zone.tz(new Date(Date.parse(item.interviewDetail.interviewStartDateTime)), clientZone).format("DD/MM/YYYY HH:mm:ss"),
                    ms = moment(startTime, "DD/MM/YYYY HH:mm:ss").diff(moment(todayLocalTime, "DD/MM/YYYY HH:mm:ss")),
                    leftTime = moment.duration(ms)._data.days + 'd:' + moment.duration(ms)._data.hours + 'h:' + moment.duration(ms)._data.minutes + 'm:' + moment.duration(ms)._data.seconds + 's';
                if (params.source.type && params.source.type.toLowerCase() === 'details') {
                    results['leftTime'] = leftTime;
                    return results;
                }
                return {message: leftTime, isExpired: false, localTime: clientInterviewStartTime};
            } else if (expiredate > new Date()) {
                return results;
            }
            return {message: zone.tz(expiredate, clientZone).format("LLLL"), isExpired: true};
        }
        return {message: results.email, isUnAuthorized: true};
    }
    return results;
};
CandidateInterviewsModel.prototype.create = function (data, callback) {
    log.info('info at CandidateInterviewsModel create method and  data');
    var self = this, count, resultsArray = [], params;
    if (data && data.sendEmail.length > 0) {
        count = data.sendEmail.length;
        params = utils({query: {name: data.subject.name}});
        async.each(data.sendEmail, function (item) {
            createInterview(data, item, function (results) {
                self.candidateInterviews.create(results, function (err, interviews) {
                    var reminderData = {
                        email: results.email,
                        interviews_id: interviews._id.toString() || 'no data',
                        interviewDetail: {
                            interviewerEmail: results.interviewDetail.interviewerEmail || 'no data',
                            emp_id: results.interviewDetail.emp_id || 'no data',
                            interviewStartDateTime: results.interviewDetail.interviewStartDateTime || 'no data',
                            interviewExpiredDateTime: results.interviewDetail.interviewExpiredDateTime || 'no data',
                            interviewType: results.interviewType || 'no data',
                            redirect_url: data.templateData.redirect_url + interviews._id || 'no data'
                        }
                    };
                    firebaseNotificationModel.addReminder(reminderData, function () {
                        return undefined;
                    });
                    resultsArray.push(interviews);
                    setTimeout(function () {
                        count -= 1;
                        var templateData = {
                            to: item.email,
                            message_type: data.templateData.message_type,
                            subject: 'Congratulations, You Got An Interview From ' + data.name,
                            redirect_url: data.templateData.redirect_url + interviews._id,
                            shareInterviewdata: {
                                linkExpires: "The Link Will Be Available From " + data.interviewStartDateTime + " to " + data.interviewExpiredDateTime,
                                challengeSubject: data.templateData.shareInterviewdata.challengeSubject,
                                addedFeatures: data.templateData.shareInterviewdata.addedFeatures
                            }
                        };
                        var pushData = {
                            "to": item.email,
                            "message": "An interview has been scheduled for you.",
                            "icon": config.dev.app_url + "/assets/images/default-user.png" ,
                            "redirect_url": data.templateData.redirect_url + interviews._id
                        };
                        if (data && data.profile_icon) {
                            pushData.icon = data.profile_icon === "assets/images/default-user.png"
                                ? config.dev.app_url + "/assets/images/default-user.png"
                                : data.profile_icon;
                        }
                        sendNotification(pushData);
                        sendMail(templateData);
                        if (count === 0) {
                            var emails = async.map(data.sendEmail, function (results) {
                                if (results && results.email) {
                                    return results.email;
                                }
                            });
                            var employerTemplate = {
                                to: data.email,
                                message_type: data.templateData.message_type,
                                subject: 'You Created An Interview',
                                shareInterviewdata: 'You Created An Interview For The Following Candidates.' + emails
                            };
                            sendMail(employerTemplate);
                            return callback(null, resultsArray);
                        }
                    }, 3000);
                });
            });
        });
    }
};
CandidateInterviewsModel.prototype.update = function (id, data, callback) {
    log.info('info at CandidateInterviewsModel update method and  data');
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    if (update && update.isInterviewCompleted) {
        update.challengeCompletedDatetime = new Date().toISOString();
    } else if (update && update.collabarateId) {
        self.interviewSchemaModel.update({
            '_id': id,
            'email': update.email
        }, {$set: {"interviewDetail.access.collabarateId": data.collabarateId}}, callback);
        return;
    }
    if(update.sendFeedBack){
        var mailData = {
            message_type: "TS_EMPLOYEE_FEEDBACK_TO_CANDIDATE",
            to: update.email,
            message: update.feedback,
            name: update.candidate_name,
            from: update.interviewDetail.interviewerEmail,
            employerName: update.interviewDetail.interviewerName,
            redirect_url:config.dev.app_url + "/#/candidate/interview-details/"+ update._id,
            interviewHeading: "Interview FeedBack"
        };
        emailEngineModel.sendMessage(mailData, function () {
        });
        self.candidateInterviews.update(conditions, update, options, callback);
    }
    if (update && update.youtube_id) {
        if (update.youtube_id.audio) {
            self.candidateInterviews.update({'_id': id}, {$set: {"youtube_id.audio": data.youtube_id.audio}}, callback);
        }
        if (update.youtube_id.video) {
            self.candidateInterviews.update({'_id': id}, {$set: {"youtube_id.video": data.youtube_id.video}}, callback);
        }
    }
    self.candidateInterviews.update(conditions, update, options, callback);
};
CandidateInterviewsModel.prototype.remove = function (id, callback) {
    log.info('info at CandidateInterviewsModel remove method and  data');
    this.candidateInterviews.remove({_id: id}, callback);
    firebaseNotificationModel.deleteNotification(id, function () {
        log.info('info at CandidateInterviewsModel remove in firebaseNotificationModel ');
    });
};
CandidateInterviewsModel.prototype.findChallengesAllCount = function (params, callback) {
    var self = this;
    self.candidateInterviews.aggregate([{$match:{"candidate_id":params.decoded._id}},
        {$unwind:"$subject"},
        {
            $group: {
                _id: "$subject.name",
                count: {$sum: 1}
            }
        }], function (err, allQuizesCount) {
        self.candidateInterviews.count({"candidate_id":params.decoded._id}, function (err, quizCount) {
            callback(err, {quizCount: quizCount, allQuizesCount: allQuizesCount});
        });
    });
};
CandidateInterviewsModel.prototype.findAllInterviewsCount = function (data, callback) {
    var self = this;
    self.candidateInterviews.count({"email":data.decoded.user_profile.email}, function (err, res) {
        callback(err, {count: res});
    });
};
CandidateInterviewsModel.prototype.findCompletedInterviewsCount = function (data, callback) {
    var self = this;
    self.candidateInterviews.count({
        "email": data.decoded.user_profile.email,
        'challengeCompletedDatetime': {$exists: true}
    }, function (err, res) {
        callback(err, {label: "completed", value: res});
    });
};
CandidateInterviewsModel.prototype.findExpiredInterviewsCount = function (data, callback) {
    var self = this,
        myDate = new Date().toISOString();
    self.candidateInterviews.count({
        "email": data.decoded.user_profile.email,
        "interviewDetail.interviewExpiredDateTime": {$lte: myDate},
        'challengeCompletedDatetime': {$exists: false}
    }, function (err, res) {
        callback(err, {label: "expired", value: res});
    });
};
CandidateInterviewsModel.prototype.findUpcomingInterviewsCount = function (data, callback) {
    var self = this,
        myDate = new Date().toISOString();
    self.candidateInterviews.count({
        "email": data.decoded.user_profile.email,
        "interviewDetail.interviewExpiredDateTime": {$gt: myDate},
        'challengeCompletedDatetime': {$exists: false}
    }, function (err, res) {
        callback(err, {label: "upcoming", value: res});
    });
};
createInterview = function (data, accessData, callback) {
    var quiz, questions = [], types = [], totalTime = 0;
    async.eachOf(data.detail.types, function (item) {
        types.push(item);
    });
    async.eachOf(data.questions.list, function (item, key) {
        if (typeof item.time === 'string') {
            item.time = parseInt(item.time, 10);
        }
        if (item.time !== 0) {
            totalTime += item.time;
        } else if (!item.time || item.time === 0) {
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
    quiz = {
        level: {
            id: data.detail.level.id,
            name: data.detail.level.name
        },
        quiz: {
            name: types,
            limit: data.detail.limit,
            totaltime: data.detail.totaltime,
            makeChallenge: data.detail.makeChallenge
        },
        subject: data.subject,
        questions: questions,
        total_time: totalTime,
        lastmoddatetime: data.lastmoddatetime,
        lastmoduserid: data.lastmoduserid,
        email: accessData.email,
        status: accessData.status,
        isVideo: data.isVideo,
        isAudio: data.isAudio,
        interviewDetail: {
            rescheduled: data.rescheduled,
            rescheduledConfirm: data.rescheduledConfirm,
            interviewId: data.interviewId,
            definitionId: data.definitionId,
            interviewerEmail: data.email,
            emp_id: data.emp_id,
            interviewerName: data.name,
            interviewType: data.type,
            source: data.questions.source,
            type: data.questions.type,
            interviewStartDateTime: data.interviewStartDateTime,
            interviewExpiredDateTime: data.interviewExpiredDateTime,
            access: {
                live: accessData.access.live,
                collaboration: accessData.access.collaboration,
                collabarateId: accessData.access.collabarateId,
                screenSharing: accessData.access.screenSharing,
                screen_sharing_id: accessData.access.screen_sharing_id,
                public: accessData.access.public
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
    callback(quiz);
};
CandidateInterviewsModel.prototype.RecentlyPerformedInterviews = function (params, callback) {
    var self = this, data = [];
    om.getAllName(params.params, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            self.candidateInterviews.find({'candidate_id':params.decoded._id}, function (err, res) {
                for (var i in res) {
                    for (var j in result) {
                        if (result[j].name === res[i].interviewDetail.positionDetails.company.name) {
                            var  companyLogo = result[j].logo
                        }
                    }
                    data.push({companyLogo:companyLogo,
                        subName: res[i].interviewDetail.positionDetails.position,
                        lastmoddatetime: res[i].lastmoddatetime,
                        _id : res[i]._id})
                }
                callback(err, data)
            }).sort({lastmoddatetime: -1}).limit(5);
        }
    })
};
CandidateInterviewsModel.prototype.UpcomingInterviews = function (params, callback) {
    var self = this, data = [], myDate = new Date().toISOString();
    om.getAllName(params.params, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            self.candidateInterviews.find({"email": params.decoded.user_profile.email,
                "interviewDetail.interviewStartDateTime": {$gte: myDate},
                'challengeCompletedDatetime': {$exists: false}}, function (err, res) {
                for (var i in res) {
                    for (var j in result) {
                        if (result[j].name === res[i].interviewDetail.positionDetails.company.name) {

                            var companyLogo = result[j].logo;
                        }
                    }
                    data.push({
                        companyLogo: companyLogo,
                        subName: res[i].interviewDetail.positionDetails.position,
                        interviewStartDateTime: res[i].interviewDetail.interviewStartDateTime
                    })
                }
                callback(err, data)
            }).sort({"interviewDetail.interviewStartDateTime": -1}).limit(3);
        }
    })
};

module.exports = CandidateInterviewsModel;
