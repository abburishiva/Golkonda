var AppMgmtCompanyModel = require('../models/mysqlModels/appMgmtCompanyModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    amc;
function AppMgmtCompanyController() {
    amc = new AppMgmtCompanyModel();
    controllerUtil = new CommonController();
}
AppMgmtCompanyController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(amc, req, res, next);
};
AppMgmtCompanyController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(amc, req, res, next);
};
AppMgmtCompanyController.prototype.create = function (req, res, next) {
    controllerUtil.create(amc, req, res, next);
};
AppMgmtCompanyController.prototype.update = function (req, res, next) {
    controllerUtil.update(amc, req, res, next);
};
AppMgmtCompanyController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(amc, req, res, next);
};

module.exports = AppMgmtCompanyController;


