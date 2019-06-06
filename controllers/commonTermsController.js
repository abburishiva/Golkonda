var CommonTermsModel = require('../models/mysqlModels/commonTermsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ct;

function CommonTermsController() {
    ct = new CommonTermsModel();
    controllerUtil = new CommonController();
}
CommonTermsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ct, req, res, next);
};
CommonTermsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ct, req, res, next);
};
CommonTermsController.prototype.create = function (req, res, next) {
    controllerUtil.create(ct, req, res, next);
};
CommonTermsController.prototype.update = function (req, res, next) {
    controllerUtil.update(ct, req, res, next);
};
CommonTermsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ct, req, res, next);
};
module.exports = CommonTermsController;

