var CandidateModel = require('../models/mysqlModels/commonCandidateModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ccm;
function CommonCandidateController() {
    ccm = new CandidateModel();
    controllerUtil = new CommonController();
}
CommonCandidateController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ccm, req, res, next);
};
CommonCandidateController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ccm, req, res, next);
};
CommonCandidateController.prototype.create = function (req, res, next) {
    controllerUtil.create(ccm, req, res, next);
};
CommonCandidateController.prototype.update = function (req, res, next) {
    controllerUtil.update(ccm, req, res, next);
};
CommonCandidateController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ccm, req, res, next);
};

module.exports = CommonCandidateController;

