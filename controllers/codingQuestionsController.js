var CodingQuestionModel = require('../models/mysqlModels/codingQuestionsModel.js'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cqm;
function CodingQuestionController() {
    cqm = new CodingQuestionModel();
    controllerUtil = new CommonController();
}
CodingQuestionController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cqm, req, res, next);
};
CodingQuestionController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cqm, req, res, next);
};
CodingQuestionController.prototype.create = function (req, res, next) {
    controllerUtil.create(cqm, req, res, next);
};
CodingQuestionController.prototype.update = function (req, res, next) {
    controllerUtil.update(cqm, req, res, next);
};
CodingQuestionController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cqm, req, res, next);
};

module.exports = CodingQuestionController;