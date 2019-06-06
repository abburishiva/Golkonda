var AppPositionModel = require('../models/mysqlModels/appPositionModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    apm;
function AppPositionController() {
    apm = new AppPositionModel();
    controllerUtil = new CommonController();
}
AppPositionController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(apm, req, res, next);
};
AppPositionController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(apm, req, res, next);
};
AppPositionController.prototype.create = function (req, res, next) {
    controllerUtil.create(apm, req, res, next);
};
AppPositionController.prototype.update = function (req, res, next) {
    controllerUtil.update(apm, req, res, next);
};
AppPositionController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(apm, req, res, next);
};

module.exports = AppPositionController;