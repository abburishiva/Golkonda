var RecCandidateLeadModel = require('../models/mysqlModels/recCandidateLeadModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    rclm;
function RecCandidateLeadController() {
    rclm = new RecCandidateLeadModel();
    controllerUtil = new CommonController();
}
RecCandidateLeadController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(rclm, req, res, next);
};
RecCandidateLeadController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(rclm, req, res, next);
};
RecCandidateLeadController.prototype.create = function (req, res, next) {
    controllerUtil.create(rclm, req, res, next);
};
RecCandidateLeadController.prototype.update = function (req, res, next) {
    controllerUtil.update(rclm, req, res, next);
};
RecCandidateLeadController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(rclm, req, res, next);
};
module.exports = RecCandidateLeadController;

