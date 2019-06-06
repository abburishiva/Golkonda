var RecCandidateModel = require('../models/mysqlModels/recCandidateModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    rcm;
function RecCandidateController() {
    rcm = new RecCandidateModel();
    controllerUtil = new CommonController();
}
RecCandidateController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(rcm, req, res, next);
};
RecCandidateController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(rcm, req, res, next);
};
RecCandidateController.prototype.create = function (req, res, next) {
    controllerUtil.create(rcm, req, res, next);
};
RecCandidateController.prototype.update = function (req, res, next) {
    controllerUtil.update(rcm, req, res, next);
};
RecCandidateController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(rcm, req, res, next);
};
module.exports = RecCandidateController;

