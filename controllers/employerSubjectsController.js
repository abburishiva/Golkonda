var EmployerSubjectsModel = require('../models/mongoModels/employerSubjectsModel'),
    CommonController = require('../utils/controllerUtil'),
    esm,
    controllerUtil;

function EmployerSubjectsController() {
    esm = new EmployerSubjectsModel();
    controllerUtil = new CommonController();
}
EmployerSubjectsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(esm, req, res, next);
};
EmployerSubjectsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(esm, req, res, next);
};
EmployerSubjectsController.prototype.create = function (req, res, next) {
    controllerUtil.create(esm, req, res, next);
};
EmployerSubjectsController.prototype.update = function (req, res, next) {
    controllerUtil.update(esm, req, res, next);
};
EmployerSubjectsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(esm, req, res, next);
};
module.exports = EmployerSubjectsController;
