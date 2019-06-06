var JobApplicationsModel = require('../models/mongoModels/jobApplicationsModel'),
    CommonController = require('../utils/controllerUtil'),
    jam, controllerUtil;

function JobApplicationsController() {
    jam = new JobApplicationsModel();
    controllerUtil = new CommonController();
}

JobApplicationsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(jam, req, res, next);
};
JobApplicationsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(jam, req, res, next);
};
JobApplicationsController.prototype.create = function (req, res, next) {
    controllerUtil.create(jam, req, res, next);
};
JobApplicationsController.prototype.update = function (req, res, next) {
    controllerUtil.update(jam, req, res, next);
};
JobApplicationsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(jam, req, res, next);
};
module.exports = JobApplicationsController;
