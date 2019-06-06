var AppEmployerModel = require('../models/mysqlModels/appEmployerModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    aem;
function AppEmployerController() {
    aem = new AppEmployerModel();
    controllerUtil = new CommonController();
}
AppEmployerController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(aem, req, res, next);
};
AppEmployerController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(aem, req, res, next);
};
AppEmployerController.prototype.create = function (req, res, next) {
    controllerUtil.create(aem, req, res, next);
};
AppEmployerController.prototype.update = function (req, res, next) {
    controllerUtil.update(aem, req, res, next);
};
AppEmployerController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(aem, req, res, next);
};
module.exports = AppEmployerController;