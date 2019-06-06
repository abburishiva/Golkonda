var StaticQuestionsModel = require('../models/mongoModels/staticQuestionsModel'),
    CommonController = require('../utils/controllerUtil'),
    sqm,
    controllerUtil;

function StaticQuestionsController() {
    sqm = new StaticQuestionsModel();
    controllerUtil = new CommonController();
}
StaticQuestionsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(sqm, req, res, next);
};
StaticQuestionsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(sqm, req, res, next);
};
StaticQuestionsController.prototype.create = function (req, res, next) {
    controllerUtil.create(sqm, req, res, next);
};
StaticQuestionsController.prototype.update = function (req, res, next) {
    controllerUtil.update(sqm, req, res, next);
};
StaticQuestionsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(sqm, req, res, next);
};
module.exports = StaticQuestionsController;

