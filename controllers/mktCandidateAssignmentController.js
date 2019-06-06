var MktCandidateAssignmentModel = require('../models/mysqlModels/mktCandidateAssignmentModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    mca;
function MktCandidateAssignmentController() {
    mca = new MktCandidateAssignmentModel();
    controllerUtil = new CommonController();
}
MktCandidateAssignmentController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(mca, req, res, next);
};
MktCandidateAssignmentController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(mca, req, res, next);
};
MktCandidateAssignmentController.prototype.create = function (req, res, next) {
    controllerUtil.create(mca, req, res, next);
};
MktCandidateAssignmentController.prototype.update = function (req, res, next) {
    controllerUtil.update(mca, req, res, next);
};
MktCandidateAssignmentController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(mca, req, res, next);
};
MktCandidateAssignmentController.prototype.search = function (req, res, next) {
    controllerUtil.search(mca, req, res, next);
};
module.exports = MktCandidateAssignmentController;