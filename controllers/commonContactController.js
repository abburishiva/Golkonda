var CommonContactModel = require('../models/mysqlModels/commonContactModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cm;
function CommonContactController() {
    cm = new CommonContactModel();
    controllerUtil = new CommonController();
}
CommonContactController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cm, req, res, next);
};
CommonContactController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cm, req, res, next);
};
CommonContactController.prototype.create = function (req, res, next) {
    controllerUtil.create(cm, req, res, next);
};
CommonContactController.prototype.update = function (req, res, next) {
    controllerUtil.update(cm, req, res, next);
};
CommonContactController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cm, req, res, next);
};
module.exports = CommonContactController;
