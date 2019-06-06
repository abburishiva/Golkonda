'use strict';
var CourseScheduleModel = require('../models/mysqlModels/courseScheduleModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    csm;
function CourseScheduleController() {
    csm = new CourseScheduleModel();
    controllerUtil = new CommonController();
}
CourseScheduleController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(csm, req, res, next);
};
CourseScheduleController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(csm, req, res, next);
};
CourseScheduleController.prototype.create = function (req, res, next) {
    controllerUtil.create(csm, req, res, next);
};
CourseScheduleController.prototype.update = function (req, res, next) {
    controllerUtil.update(csm, req, res, next);
};
CourseScheduleController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(csm, req, res, next);
};
module.exports = CourseScheduleController;
