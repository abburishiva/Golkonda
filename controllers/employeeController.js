var EmployerModel = require('../models/mongoModels/employeeModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    eam;
function EmployerController() {
    eam = new EmployerModel();
    controllerUtil = new CommonController();
}
EmployerController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(eam, req, res, next);
};
EmployerController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(eam, req, res, next);
};
EmployerController.prototype.create = function (req, res, next) {
    controllerUtil.create(eam, req, res, next);
};
EmployerController.prototype.update = function (req, res, next) {
    controllerUtil.update(eam, req, res, next);
};
EmployerController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(eam, req, res, next);
};
module.exports = EmployerController;