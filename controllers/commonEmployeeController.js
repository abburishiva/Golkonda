var CommonEmployeeModel = require('../models/mysqlModels/commonEmployeeModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cem;
function CommonEmployeeController() {
    cem = new CommonEmployeeModel();
    controllerUtil = new CommonController();
}

CommonEmployeeController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cem, req, res, next);
};
CommonEmployeeController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cem, req, res, next);
};
CommonEmployeeController.prototype.create = function (req, res, next) {
    controllerUtil.create(cem, req, res, next);
};
CommonEmployeeController.prototype.update = function (req, res, next) {
    controllerUtil.update(cem, req, res, next);
};
CommonEmployeeController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cem, req, res, next);
};

module.exports = CommonEmployeeController;