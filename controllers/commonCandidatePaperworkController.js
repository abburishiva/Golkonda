var CommonCandidatePaperworkModel = require('../models/mysqlModels/commonCandidatePaperworkModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ccpm;
function CommonCandidatePaperworkController() {
    ccpm = new CommonCandidatePaperworkModel();
    controllerUtil = new CommonController();
}
CommonCandidatePaperworkController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ccpm, req, res, next);
};
CommonCandidatePaperworkController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ccpm, req, res, next);
};
CommonCandidatePaperworkController.prototype.create = function (req, res, next) {
    controllerUtil.create(ccpm, req, res, next);
};
CommonCandidatePaperworkController.prototype.update = function (req, res, next) {
    controllerUtil.update(ccpm, req, res, next);
};
CommonCandidatePaperworkController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ccpm, req, res, next);
};

module.exports = CommonCandidatePaperworkController;