var CommonEmailAccountModel = require('../models/mysqlModels/commonEmailAccountModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cea;
function CommonEmailAccountController() {
    cea = new CommonEmailAccountModel();
    controllerUtil = new CommonController();
}
CommonEmailAccountController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cea, req, res, next);
};
CommonEmailAccountController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cea, req, res, next);
};
CommonEmailAccountController.prototype.create = function (req, res, next) {
    controllerUtil.create(cea, req, res, next);
};
CommonEmailAccountController.prototype.update = function (req, res, next) {
    controllerUtil.update(cea, req, res, next);
};
CommonEmailAccountController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cea, req, res, next);
};
module.exports = CommonEmailAccountController;