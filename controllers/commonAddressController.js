var CommonAddressModel = require('../models/mysqlModels/commonAddressModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ca;
function CommonAddressController() {
    ca = new CommonAddressModel();
    controllerUtil = new CommonController();
}
CommonAddressController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ca, req, res, next);
};
CommonAddressController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ca, req, res, next);
};
CommonAddressController.prototype.create = function (req, res, next) {
    controllerUtil.create(ca, req, res, next);
};
CommonAddressController.prototype.update = function (req, res, next) {
    controllerUtil.update(ca, req, res, next);
};
CommonAddressController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ca, req, res, next);
};
module.exports = CommonAddressController;