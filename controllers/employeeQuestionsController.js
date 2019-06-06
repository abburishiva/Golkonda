var EmployerQuestionsModel = require('../models/mongoModels/employeeQuestionsModel'),
    CommonController = require('../utils/controllerUtil'),
    eqm,
    controllerUtil;
function EmployerQuestionsController() {
    eqm = new EmployerQuestionsModel();
    controllerUtil = new CommonController();
}
EmployerQuestionsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(eqm, req, res, next);
};
EmployerQuestionsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(eqm, req, res, next);
};
EmployerQuestionsController.prototype.create = function (req, res, next) {
    controllerUtil.create(eqm, req, res, next);
};
EmployerQuestionsController.prototype.update = function (req, res, next) {
    controllerUtil.update(eqm, req, res, next);
};
EmployerQuestionsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(eqm, req, res, next);
};
module.exports = EmployerQuestionsController;
