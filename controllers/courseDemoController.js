var CourseDemoModel = require('../models/mysqlModels/courseDemoModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cdc;
function CourseDemoController() {
    cdc = new CourseDemoModel();
    controllerUtil = new CommonController();
}
CourseDemoController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cdc, req, res, next);
};
CourseDemoController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cdc, req, res, next);
};
CourseDemoController.prototype.create = function (req, res, next) {
    controllerUtil.create(cdc, req, res, next);
};
CourseDemoController.prototype.update = function (req, res, next) {
    controllerUtil.update(cdc, req, res, next);
};
CourseDemoController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cdc, req, res, next);
};
CourseDemoController.prototype.search = function (req, res, next) {
    controllerUtil.search(cdc, req, res, next);
};
module.exports = CourseDemoController;