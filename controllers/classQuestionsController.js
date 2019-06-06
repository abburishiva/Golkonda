var ClassQuestionsModel = require('../models/mysqlModels/classQuestionsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cqm;
function ClassQuestionsController() {
    cqm = new ClassQuestionsModel();
    controllerUtil = new CommonController();
}
ClassQuestionsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cqm, req, res, next);
};
ClassQuestionsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cqm, req, res, next);
};
ClassQuestionsController.prototype.create = function (req, res, next) {
    controllerUtil.create(cqm, req, res, next);
};
ClassQuestionsController.prototype.update = function (req, res, next) {
    controllerUtil.update(cqm, req, res, next);
};
ClassQuestionsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cqm, req, res, next);
};
module.exports = ClassQuestionsController;
