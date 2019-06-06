var ChallengesModel = require('../models/mongoModels/challengesModel'),
    CommonController = require('../utils/controllerUtil'),
    QuestionModel = require('../models/mysqlModels/questionsModel'),
    EmailEngineModel = require('../models/mysqlModels/emailEngineModel'),
    modelParams = require('../utils/params/modelParameters'),
    Logger = require('../utils/winston/logModule'),
    controllerUtil,
    questionModel,
    log,
    cm,
    em;
function ChallengesController() {
    cm = new ChallengesModel();
    controllerUtil = new CommonController();
    questionModel = new QuestionModel();
    em = new EmailEngineModel();
    log = new Logger();
}
ChallengesController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cm, req, res, next);
};
ChallengesController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cm, req, res, next);
};
ChallengesController.prototype.create = function (req, res, next) {
    var self = this;
    log.info("info at create method in ChallengesController.");
    if (req.params.candidate_id) {
        req.body.candidate_id = req.params.candidate_id;
    }
    if (req.body && req.body.challengeid) {
        controllerUtil.create(cm, req, res, next);
    } else if (req.body && req.body.isTestServer) {
        return self.createChallenge({}, 1, req, res, next);
    } else if (req.body.quiztype && req.body.subjectid && req.body.levelid && req.body.candidate_id) {
        log.info("info  at creating quiztype in ChallengesController.");
        if (req.body.quiztype.toLowerCase() === 'choice') {
            log.info("info  at creating choice quiz in ChallengesController.");
            self.createChallenge(15, 1, req, res, next);
        } else if (req.body.quiztype.toLowerCase() === 'coding') {
            log.info("info  at creating coding quiz in ChallengesController.");
            self.createChallenge(10, 2, req, res, next);
        } else if (req.body.quiztype.toLowerCase() === 'video') {
            log.info("info  at creating video quiz in ChallengesController.");
            self.createChallenge(10, 3, req, res, next);
        } else if (req.body.quiztype.toLowerCase() === 'audio') {
            log.info("info  at creating audio quiz in ChallengesController.");
            self.createChallenge(10, 2, req, res, next);
        } else if (req.body.quiztype.toLowerCase() === 'whiteboard') {
            log.info("info  at creating whiteboard quiz in ChallengesController.");
            self.createChallenge(10, 2, req, res, next);
        } else if (req.body.quiztype.toLowerCase() === 'typed') {
            log.info("info  at creating typed quiz in ChallengesController.");
            self.createChallenge(10, 2, req, res, next);
        } else {
            return next({status: 400, error: {message: 'BadRequest'}});
        }
    } else {
        return next({status: 400, error: {message: 'BadRequest'}});
    }
};
ChallengesController.prototype.update = function (req, res, next) {
    log.info("info at update method in ChallengesController.");
    if (req.body.collabarateId) {
        var mailData = {
            to: "devs@innova-path.com",
            message_type: req.body.message_type,
            name: req.body.collabarateId,
            message: req.body.collabarateUrl
        };
        em.sendMessage(mailData, function (err, data) {
            if (err) {
                log.error(err);
                return ({status: 500, error: err});
            }
            if (data) {
                return ({status: 200, message: ''});
            }
        });
    }
    controllerUtil.update(cm, req, res, next);
    log.info("info at update method in ChallengesController and req goes to controllerUtilsfunction");
};
ChallengesController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cm, req, res, next);
};
ChallengesController.prototype.createChallenge = function (limit, type, req, res, next) {
    log.info("info at createChallenge method in ChallengesController.");
    req.query = {
        subjectid: req.body.subjectid,
        levelid: req.body.levelid,
        questiontype: req.body.quiztype,
        type: "ts"
    };
    var params = modelParams(req);
    log.info("info at createChallenge method in ChallengesController and req goes to questions model in mySql models.");
    if (!req.body.isTestServer) {
        questionModel.find(params, function (err, data) {
            if (err) {
                return next({status: 500, error: err});
            }
            if (data.length <= 0) {
                res.status(200).json({status: 404, message: 'Records Not Found'});
            } else {
                var customArray = [], count = 0;
                if (data.length < limit) {
                    limit = data.length;
                }
                getRandomQuestion:while (true) {
                    var item = data[Math.floor(Math.random() * data.length)].id;
                    if (customArray.indexOf(item) < 0) {
                        customArray.push(item);
                        count++;
                        if (count === limit) {
                            params.filters.randomQuiz = customArray.toString();
                            delete params.paging.limitstart;
                            delete params.paging.limitend;
                            quizData(params);
                            break;
                        } else {
                            continue getRandomQuestion;
                        }
                    } else {
                        continue getRandomQuestion;
                    }
                }
            }
        });
    } else {
        params.filters.randomQuiz = req.body.randomQuiz;
        quizData(params);
    }
    function quizData(params) {
        var quiz, sourceData;
        questionModel.find(params, function (err, data) {
            if (err) {
                return next({status: 500, error: err});
            }
            if (data.length <= 0) {
                res.status(200).json({status: 404, message: 'Records Not Found'});
            } else {
                if (req.body && req.body.quiztype) {
                    quiz = req.body.quiztype.toLowerCase();
                }
                sourceData = {
                    source: data,
                    quizTypeId: type,
                    quizTypeName: quiz,
                    candidate_id: req.body.candidate_id,
                    email: req.body.email
                };
                req.body = sourceData;
                controllerUtil.create(cm, req, res, next);
            }
        });
    }
};

module.exports = ChallengesController;
