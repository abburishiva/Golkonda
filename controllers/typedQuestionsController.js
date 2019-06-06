var TypedQuestionsModel = require('../models/mysqlModels/typedQuestionsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    tqm;
function TypedQuestionsController() {
    controllerUtil = new CommonController();
    tqm = new TypedQuestionsModel();
}
TypedQuestionsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(tqm, req, res, next);
};
TypedQuestionsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(tqm, req, res, next);
};
TypedQuestionsController.prototype.create = function (req, res, next) {
    controllerUtil.create(tqm, req, res, next);
};
TypedQuestionsController.prototype.update = function (req, res, next) {
    controllerUtil.update(tqm, req, res, next);
};
TypedQuestionsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(tqm, req, res, next);
};
module.exports = TypedQuestionsController;
