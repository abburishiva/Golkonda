var VideoQuestionModel = require('../models/mysqlModels/videoQuestionsModel.js'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    vqm;
function VideoQuestionController() {
    vqm = new VideoQuestionModel();
    controllerUtil = new CommonController();
}
VideoQuestionController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(vqm, req, res, next);
};
VideoQuestionController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(vqm, req, res, next);
};
VideoQuestionController.prototype.create = function (req, res, next) {
    controllerUtil.create(vqm, req, res, next);
};
VideoQuestionController.prototype.update = function (req, res, next) {
    controllerUtil.update(vqm, req, res, next);
};
VideoQuestionController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(vqm, req, res, next);
};

module.exports = VideoQuestionController;