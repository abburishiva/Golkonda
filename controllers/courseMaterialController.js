var CourseMaterialModel = require('../models/mysqlModels/courseMaterialModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cm;
function CourseMaterialController() {
    cm = new CourseMaterialModel();
    controllerUtil = new CommonController();
}
CourseMaterialController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cm, req, res, next);
};
CourseMaterialController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cm, req, res, next);
};
CourseMaterialController.prototype.create = function (req, res, next) {
    controllerUtil.create(cm, req, res, next);
};
CourseMaterialController.prototype.update = function (req, res, next) {
    controllerUtil.update(cm, req, res, next);
};
CourseMaterialController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cm, req, res, next);
};
module.exports = CourseMaterialController;




