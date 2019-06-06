var ClassNotesModel = require('../models/mysqlModels/classNotesModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cnm;
function ClassNotesController() {
    cnm = new ClassNotesModel();
    controllerUtil = new CommonController();
}
ClassNotesController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cnm, req, res, next);
};
ClassNotesController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cnm, req, res, next);
};
ClassNotesController.prototype.create = function (req, res, next) {
    controllerUtil.create(cnm, req, res, next);
};
ClassNotesController.prototype.update = function (req, res, next) {
    controllerUtil.update(cnm, req, res, next);
};
ClassNotesController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cnm, req, res, next);
};

module.exports = ClassNotesController;

