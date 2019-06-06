var CourseSubjectModel = require('../models/mysqlModels/courseSubjectModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    xcs;
function CourseSubjectController() {
    xcs = new CourseSubjectModel();
    controllerUtil = new CommonController();
}
CourseSubjectController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(xcs, req, res, next);
};
CourseSubjectController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(xcs, req, res, next);
};
CourseSubjectController.prototype.create = function (req, res, next) {
    controllerUtil.create(xcs, req, res, next);
};
CourseSubjectController.prototype.update = function (req, res, next) {
    controllerUtil.update(xcs, req, res, next);
};
CourseSubjectController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(xcs, req, res, next);
};
module.exports = CourseSubjectController;



