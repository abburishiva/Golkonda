var QuestionsModel = require('../models/mysqlModels/questionsModel'),
    ChoiceQuestionsModel = require('../models/mysqlModels/choiceQuestionsModel'),
    CodingQuestionsModel = require('../models/mysqlModels/codingQuestionsModel'),
    VideoQuestionsModel = require('../models/mysqlModels/videoQuestionsModel'),
    AudioQuestionsModel = require('../models/mysqlModels/audioQuestionsModel'),
    TypedQuestionsModel = require('../models/mysqlModels/typedQuestionsModel'),
    WhiteBoardQuestionsModel = require('../models/mysqlModels/whiteBoardQuestionsModel'),
    CommonController = require('../utils/controllerUtil'),
    Logger = require('../utils/winston/logModule'),
    qm,
    aqm,
    cc,
    cqm,
    tqm,
    coqm,
    wqm,
    vqm,
    log;
function QuestionsController() {
    qm = new QuestionsModel();
    cc = new CommonController();
    cqm = new ChoiceQuestionsModel();
    coqm = new CodingQuestionsModel();
    vqm = new VideoQuestionsModel();
    aqm = new AudioQuestionsModel();
    tqm = new TypedQuestionsModel();
    wqm = new WhiteBoardQuestionsModel();
    log = new Logger();
    log.info("This is questionsController Constructor...");
}
QuestionsController.prototype.getAll = function (req, res, next) {
    log.info("This is getAll function in questionsController...");
    cc.get(qm, req, res, next);
};
QuestionsController.prototype.getById = function (req, res, next) {
    log.info("This is getById function in questionsController...");
    if (req.query && req.query.questiontype) {
        if (req.query.questiontype.toLowerCase() === 'choice') {
            cc.getById(cqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'coding') {
            cc.getById(coqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'video') {
            cc.getById(vqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'audio') {
            cc.getById(aqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'typed') {
            cc.getById(tqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'whiteboard') {
            cc.getById(wqm, req, res, next);
        } else {
            return next({status: 400, error: {message: 'BadRequest'}});
        }
    } else {
        return next({status: 400, error: {message: 'BadRequest'}});
    }
};

QuestionsController.prototype.create = function (req, res, next) {
    log.info("This is create function in questionsController...");
    var questiontype = req.query.questiontype.match(/[^,]+/g);
    if (questiontype && questiontype.length === 1) {
        if (questiontype[0].toLowerCase() === 'video') {
            cc.create(vqm, req, res, next);
        } else if (questiontype[0].toLowerCase() === 'choice') {
            cc.create(cqm, req, res, next);
        } else if (questiontype[0].toLowerCase() === 'coding') {
            cc.create(coqm, req, res, next);
        } else if (questiontype[0].toLowerCase() === 'audio') {
            cc.create(aqm, req, res, next);
        } else if (questiontype[0].toLowerCase() === 'typed') {
            cc.create(tqm, req, res, next);
        } else if (questiontype[0].toLowerCase() === 'whiteboard') {
            cc.create(wqm, req, res, next);
        } else {
            return next({status: 400, error: {message: 'BadRequest'}});
        }
    } else if (questiontype && questiontype.length > 1 && questiontype.length < 4) {
        req.body.questiontype = questiontype;
        log.info("posting data to mult question...");
        cc.create(qm, req, res, next);
    } else {
        return next({status: 400, error: {message: 'BadRequest'}});
    }
};

QuestionsController.prototype.update = function (req, res, next) {
    log.info("This is update function in questionsController...");
    if (req.query && req.query.questiontype) {
        if (req.query.questiontype.toLowerCase() === 'video') {
            cc.update(vqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'choice') {
            cc.update(cqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'coding') {
            cc.update(coqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'audio') {
            cc.update(aqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'typed') {
            cc.update(tqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'whiteboard') {
            cc.update(wqm, req, res, next);
        } else {
            return next({status: 400, error: {message: 'BadRequest'}});
        }
    } else {
        return next({status: 400, error: {message: 'BadRequest'}});
    }
};

QuestionsController.prototype.remove = function (req, res, next) {
    log.info("This is remove function in questionsController...");
    if (req.query && req.query.questiontype) {
        if (req.query.questiontype.toLowerCase() === 'choice') {
            cc.remove(cqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'coding') {
            cc.remove(coqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'video') {
            cc.remove(vqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'audio') {
            cc.remove(aqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'typed') {
            cc.remove(tqm, req, res, next);
        } else if (req.query.questiontype.toLowerCase() === 'whiteboard') {
            cc.remove(wqm, req, res, next);
        } else {
            return next({status: 400, error: {message: 'BadRequest'}});
        }
    } else {
        return next({status: 400, error: {message: 'BadRequest'}});
    }
};
module.exports = QuestionsController;
