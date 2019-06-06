var MktCandidateLeadModel = require('../models/mysqlModels/mktCandidateLeadModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    mcl;
function MktCandidateLeadController() {
    mcl = new MktCandidateLeadModel();
    controllerUtil = new CommonController();
}
MktCandidateLeadController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(mcl, req, res, next);
};
MktCandidateLeadController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(mcl, req, res, next);
};
MktCandidateLeadController.prototype.create = function (req, res, next) {
    controllerUtil.create(mcl, req, res, next);
};
MktCandidateLeadController.prototype.update = function (req, res, next) {
    controllerUtil.update(mcl, req, res, next);
};
MktCandidateLeadController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(mcl, req, res, next);
};

module.exports = MktCandidateLeadController;


