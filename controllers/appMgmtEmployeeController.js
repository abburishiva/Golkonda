var AppMgmtEmployeeModel = require('../models/mysqlModels/appMgmtEmployeeModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ame;
function AppMgmtEmployeeController() {
    ame = new AppMgmtEmployeeModel();
    controllerUtil = new CommonController();
}
AppMgmtEmployeeController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ame, req, res, next);
};
AppMgmtEmployeeController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ame, req, res, next);
};
AppMgmtEmployeeController.prototype.create = function (req, res, next) {
    controllerUtil.create(ame, req, res, next);
};
AppMgmtEmployeeController.prototype.update = function (req, res, next) {
    controllerUtil.update(ame, req, res, next);
};
AppMgmtEmployeeController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ame, req, res, next);
};
module.exports = AppMgmtEmployeeController;



