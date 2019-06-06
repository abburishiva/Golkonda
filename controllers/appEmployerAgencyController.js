var AppEmployerAgencyModel = require('../models/mysqlModels/appEmployerAgencyModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    aeg;
function AppEmployerAgencyController() {
    aeg = new AppEmployerAgencyModel();
    controllerUtil = new CommonController();
}
AppEmployerAgencyController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(aeg, req, res, next);
};
AppEmployerAgencyController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(aeg, req, res, next);
};
AppEmployerAgencyController.prototype.create = function (req, res, next) {
    controllerUtil.create(aeg, req, res, next);
};
AppEmployerAgencyController.prototype.update = function (req, res, next) {
    controllerUtil.update(aeg, req, res, next);
};
AppEmployerAgencyController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(aeg, req, res, next);
};

module.exports = AppEmployerAgencyController;