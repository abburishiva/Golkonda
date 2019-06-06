var SubjectModel = require('../models/mysqlModels/subjectModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    sm;
function SubjectController() {
    sm = new SubjectModel();
    controllerUtil = new CommonController();
}
SubjectController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(sm, req, res, next);
};
SubjectController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(sm, req, res, next);
};
SubjectController.prototype.create = function (req, res, next) {
    controllerUtil.create(sm, req, res, next);
};
SubjectController.prototype.update = function (req, res, next) {
    controllerUtil.update(sm, req, res, next);
};
SubjectController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(sm, req, res, next);
};

module.exports = SubjectController;
