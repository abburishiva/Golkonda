var CourseModel = require('../models/mysqlModels/courseModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    csm;
function CourseController() {
    csm = new CourseModel();
    controllerUtil = new CommonController();
}
CourseController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(csm, req, res, next);
};
CourseController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(csm, req, res, next);
};
CourseController.prototype.create = function (req, res, next) {
    controllerUtil.create(csm, req, res, next);
};
CourseController.prototype.update = function (req, res, next) {
    controllerUtil.update(csm, req, res, next);
};
CourseController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(csm, req, res, next);
};
module.exports = CourseController;

