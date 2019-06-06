var EmpInterviews = require('../models/mongoModels/employerInterviewsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    eic;

function EmployerInterviewsController() {
    eic = new EmpInterviews();
    controllerUtil = new CommonController();
}

EmployerInterviewsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(eic, req, res, next);
};
EmployerInterviewsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(eic, req, res, next);
};
EmployerInterviewsController.prototype.create = function (req, res, next) {
    controllerUtil.create(eic, req, res, next);
};
EmployerInterviewsController.prototype.update = function (req, res, next) {
    controllerUtil.update(eic, req, res, next);
};
EmployerInterviewsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(eic, req, res, next);
};
EmployerInterviewsController.prototype.positions = function (req, res, next) {
    controllerUtil.get(eic, req, res, next);
};

module.exports = EmployerInterviewsController;