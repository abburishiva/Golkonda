var ChoiceQuestionModel = require('../models/mysqlModels/choiceQuestionsModel.js'),
    CommonController = require('../utils/controllerUtil'),
    Logger = require('../utils/winston/logModule'),
    controllerUtil,
    cqm,
    log;
function ChoiceQuestionController() {
    cqm = new ChoiceQuestionModel();
    controllerUtil = new CommonController();
    log = new Logger();
    log.info("This is choiceQuestionController Constructor...");
}
ChoiceQuestionController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cqm, req, res, next);
};
ChoiceQuestionController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cqm, req, res, next);
};
ChoiceQuestionController.prototype.create = function (req, res, next) {
    controllerUtil.create(cqm, req, res, next);
};
ChoiceQuestionController.prototype.update = function (req, res, next) {
    controllerUtil.update(cqm, req, res, next);
};
ChoiceQuestionController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cqm, req, res, next);
};
module.exports = ChoiceQuestionController;