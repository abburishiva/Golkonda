var CourseBatchModel = require('../models/mysqlModels/courseBatchModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cbm;
function CourseBatchController() {
    cbm = new CourseBatchModel();
    controllerUtil = new CommonController();
}
CourseBatchController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cbm, req, res, next);
};
CourseBatchController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cbm, req, res, next);
};
CourseBatchController.prototype.create = function (req, res, next) {
    controllerUtil.create(cbm, req, res, next);
};
CourseBatchController.prototype.update = function (req, res, next) {
    controllerUtil.update(cbm, req, res, next);
};
CourseBatchController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cbm, req, res, next);
};
CourseBatchController.prototype.search = function (req, res, next) {
    controllerUtil.search(cbm, req, res, next);
};

module.exports = CourseBatchController;