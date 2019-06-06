var CommonCompanyModel = require('../models/mysqlModels/commonCompanyModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ccm;
function CommonCompanyController() {
    ccm = new CommonCompanyModel();
    controllerUtil = new CommonController();
}
CommonCompanyController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ccm, req, res, next);
};
CommonCompanyController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ccm, req, res, next);
};
CommonCompanyController.prototype.create = function (req, res, next) {
    controllerUtil.create(ccm, req, res, next);
};
CommonCompanyController.prototype.update = function (req, res, next) {
    controllerUtil.update(ccm, req, res, next);
};
CommonCompanyController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ccm, req, res, next);
};

module.exports = CommonCompanyController;

