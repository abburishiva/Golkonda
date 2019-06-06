var RecCandidateLoginHistoryModel = require('../models/mysqlModels/recCandidateLoginHistoryModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ahm;
function RecCandidateLoginHistoryController() {
    ahm = new RecCandidateLoginHistoryModel();
    controllerUtil = new CommonController();
}
RecCandidateLoginHistoryController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ahm, req, res, next);
};
RecCandidateLoginHistoryController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ahm, req, res, next);
};
RecCandidateLoginHistoryController.prototype.create = function (req, res, next) {
    controllerUtil.create(ahm, req, res, next);
};
RecCandidateLoginHistoryController.prototype.update = function (req, res, next) {
    controllerUtil.update(ahm, req, res, next);
};
RecCandidateLoginHistoryController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ahm, req, res, next);
};
module.exports = RecCandidateLoginHistoryController;

