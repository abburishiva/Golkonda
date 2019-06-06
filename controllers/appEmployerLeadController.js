var AppEmployerLeadModel = require('../models/mysqlModels/appEmployerLeadModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ael;
function AppEmployerLeadController() {
    ael = new AppEmployerLeadModel();
    controllerUtil = new CommonController();
}
AppEmployerLeadController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ael, req, res, next);
};
AppEmployerLeadController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ael, req, res, next);
};
AppEmployerLeadController.prototype.create = function (req, res, next) {
    controllerUtil.create(ael, req, res, next);
};
AppEmployerLeadController.prototype.update = function (req, res, next) {
    controllerUtil.update(ael, req, res, next);
};
AppEmployerLeadController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ael, req, res, next);
};
module.exports = AppEmployerLeadController;