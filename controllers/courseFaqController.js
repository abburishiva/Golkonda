var CourseFaqModel = require('../models/mysqlModels/courseFaqModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cf;
function CourseFaqController() {
    cf = new CourseFaqModel();
    controllerUtil = new CommonController();
}
CourseFaqController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cf, req, res, next);
};
CourseFaqController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cf, req, res, next);
};
CourseFaqController.prototype.create = function (req, res, next) {
    controllerUtil.create(cf, req, res, next);
};
CourseFaqController.prototype.update = function (req, res, next) {
    controllerUtil.update(cf, req, res, next);
};
CourseFaqController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cf, req, res, next);
};
module.exports = CourseFaqController;




