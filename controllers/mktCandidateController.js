var MktCandidateModel = require('../models/mysqlModels/mktCandidateModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    mcm;
function MktCandidateController() {
    mcm = new MktCandidateModel();
    controllerUtil = new CommonController();
}
MktCandidateController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(mcm, req, res, next);
};
MktCandidateController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(mcm, req, res, next);
};
MktCandidateController.prototype.create = function (req, res, next) {
    controllerUtil.create(mcm, req, res, next);
};
MktCandidateController.prototype.update = function (req, res, next) {
    controllerUtil.update(mcm, req, res, next);
};
MktCandidateController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(mcm, req, res, next);
};

module.exports = MktCandidateController;


