var ClassAssignmentModel = require('../models/mysqlModels/classAssignmentModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cac;
function ClassAssignmentController() {
    cac = new ClassAssignmentModel();
    controllerUtil = new CommonController();
}
ClassAssignmentController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cac, req, res, next);
};
ClassAssignmentController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cac, req, res, next);
};
ClassAssignmentController.prototype.create = function (req, res, next) {
    controllerUtil.create(cac, req, res, next);
};
ClassAssignmentController.prototype.update = function (req, res, next) {
    controllerUtil.update(cac, req, res, next);
};
ClassAssignmentController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cac, req, res, next);
};
ClassAssignmentController.prototype.search = function (req, res, next) {
    controllerUtil.search(cac, req, res, next);
};

module.exports = ClassAssignmentController;