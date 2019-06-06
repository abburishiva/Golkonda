var CourseContentModel = require('../models/mysqlModels/courseContentModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cm;
function CourseContentController() {
    cm = new CourseContentModel();
    controllerUtil = new CommonController();
}
CourseContentController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cm, req, res, next);
};
CourseContentController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cm, req, res, next);
};
CourseContentController.prototype.create = function (req, res, next) {
    controllerUtil.create(cm, req, res, next);
};
CourseContentController.prototype.update = function (req, res, next) {
    controllerUtil.update(cm, req, res, next);
};
CourseContentController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cm, req, res, next);
};
module.exports = CourseContentController;