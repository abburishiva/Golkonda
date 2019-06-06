var CommonLevelModel = require('../models/mysqlModels/commonLevelModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cl;
function CommonLevelController() {
    cl = new CommonLevelModel();
    controllerUtil = new CommonController();
}
CommonLevelController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cl, req, res, next);
};
CommonLevelController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cl, req, res, next);
};
CommonLevelController.prototype.create = function (req, res, next) {
    controllerUtil.create(cl, req, res, next);
};
CommonLevelController.prototype.update = function (req, res, next) {
    controllerUtil.update(cl, req, res, next);
};
CommonLevelController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cl, req, res, next);
};

module.exports = CommonLevelController;

