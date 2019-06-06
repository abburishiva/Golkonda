var CandidateQuizDetailsModel = require('../models/mysqlModels/candidateQuizDetailsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cqdm;
function CandidateQuizDetailsController() {
    cqdm = new CandidateQuizDetailsModel();
    controllerUtil = new CommonController();
}
CandidateQuizDetailsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cqdm, req, res, next);
};
CandidateQuizDetailsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cqdm, req, res, next);
};
CandidateQuizDetailsController.prototype.create = function (req, res, next) {
    controllerUtil.create(cqdm, req, res, next);
};
CandidateQuizDetailsController.prototype.update = function (req, res, next) {
    controllerUtil.update(cqdm, req, res, next);
};
CandidateQuizDetailsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cqdm, req, res, next);
};
module.exports = CandidateQuizDetailsController;

