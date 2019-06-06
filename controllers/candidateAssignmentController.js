var CandidateAssignmentModel = require('../models/mysqlModels/candidateAssignmentModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cacc;
function CandidateAssignmentController() {
    cacc = new CandidateAssignmentModel();
    controllerUtil = new CommonController();
}
CandidateAssignmentController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cacc, req, res, next);
};
CandidateAssignmentController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cacc, req, res, next);
};
CandidateAssignmentController.prototype.create = function (req, res, next) {
    controllerUtil.create(cacc, req, res, next);
};
CandidateAssignmentController.prototype.update = function (req, res, next) {
    controllerUtil.update(cacc, req, res, next);
};
CandidateAssignmentController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cacc, req, res, next);
};
CandidateAssignmentController.prototype.search = function (req, res, next) {
    controllerUtil.search(cacc, req, res, next);
};

module.exports = CandidateAssignmentController;