var LeadSourceModel = require('../models/mysqlModels/leadSourceModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    lsm;
function LeadSourceController() {
    lsm = new LeadSourceModel();
    controllerUtil = new CommonController();
}
LeadSourceController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(lsm, req, res, next);
};
LeadSourceController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lsm, req, res, next);
};
LeadSourceController.prototype.create = function (req, res, next) {
    controllerUtil.create(lsm, req, res, next);
};
LeadSourceController.prototype.update = function (req, res, next) {
    controllerUtil.update(lsm, req, res, next);
};
LeadSourceController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lsm, req, res, next);
};
module.exports = LeadSourceController;

