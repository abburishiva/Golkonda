var AudioQuestionsModel = require('../models/mysqlModels/audioQuestionsModel.js'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    aqm;

function AudioQuestionsController() {
    aqm = new AudioQuestionsModel();
    controllerUtil = new CommonController();
}
AudioQuestionsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(aqm, req, res, next);
};
AudioQuestionsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(aqm, req, res, next);
};
AudioQuestionsController.prototype.create = function (req, res, next) {
    controllerUtil.create(aqm, req, res, next);
};
AudioQuestionsController.prototype.update = function (req, res, next) {
    controllerUtil.update(aqm, req, res, next);
};
AudioQuestionsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(aqm, req, res, next);
};

module.exports = AudioQuestionsController;