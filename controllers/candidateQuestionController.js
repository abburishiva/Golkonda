var CandidateQuestionModel = require('../models/mysqlModels/candidateQuestionModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cq;
function CandidateQuestionController() {
    cq = new CandidateQuestionModel();
    controllerUtil = new CommonController();
}
CandidateQuestionController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cq, req, res, next);
};
CandidateQuestionController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cq, req, res, next);
};
CandidateQuestionController.prototype.create = function (req, res, next) {
    controllerUtil.create(cq, req, res, next);
};
CandidateQuestionController.prototype.update = function (req, res, next) {
    controllerUtil.update(cq, req, res, next);
};
CandidateQuestionController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cq, req, res, next);
};
CandidateQuestionController.prototype.search = function (req, res, next) {
    controllerUtil.search(cq, req, res, next);
};

module.exports = CandidateQuestionController;