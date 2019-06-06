var CommonValuesModel = require('../models/mysqlModels/commonValuesModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cv;
function CommonValuesController() {
    cv = new CommonValuesModel();
    controllerUtil = new CommonController();
}
CommonValuesController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cv, req, res, next);
};
CommonValuesController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cv, req, res, next);
};
CommonValuesController.prototype.create = function (req, res, next) {
    controllerUtil.create(cv, req, res, next);
};
CommonValuesController.prototype.update = function (req, res, next) {
    controllerUtil.update(cv, req, res, next);
};
CommonValuesController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cv, req, res, next);
};
module.exports = CommonValuesController;

