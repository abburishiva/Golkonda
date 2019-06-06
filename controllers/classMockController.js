var ClassMockModel = require('../models/mysqlModels/classMockModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cmm;
function ClassMockController() {
    cmm = new ClassMockModel();
    controllerUtil = new CommonController();
}
ClassMockController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cmm, req, res, next);
};
ClassMockController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cmm, req, res, next);
};
ClassMockController.prototype.create = function (req, res, next) {
    controllerUtil.create(cmm, req, res, next);
};
ClassMockController.prototype.update = function (req, res, next) {
    controllerUtil.update(cmm, req, res, next);
};
ClassMockController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cmm, req, res, next);
};
ClassMockController.prototype.search = function (req, res, next) {
    controllerUtil.search(cmm, req, res, next);
};
module.exports = ClassMockController;