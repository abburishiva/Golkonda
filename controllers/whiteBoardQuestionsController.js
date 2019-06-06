var WhiteBoardController = require('../models/mysqlModels/whiteBoardQuestionsModel.js'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    wqm;

function WhiteBoardQuestionsController() {
    wqm = new WhiteBoardController();
    controllerUtil = new CommonController();
}
WhiteBoardQuestionsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(wqm, req, res, next);
};
WhiteBoardQuestionsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(wqm, req, res, next);
};
WhiteBoardQuestionsController.prototype.create = function (req, res, next) {
    controllerUtil.create(wqm, req, res, next);
};
WhiteBoardQuestionsController.prototype.update = function (req, res, next) {
    controllerUtil.update(wqm, req, res, next);
};
WhiteBoardQuestionsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(wqm, req, res, next);
};
module.exports = WhiteBoardQuestionsController;