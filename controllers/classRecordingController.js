var ClassRecordingModel = require('../models/mysqlModels/classRecordingModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cr;
function ClassRecordingController() {
    cr = new ClassRecordingModel();
    controllerUtil = new CommonController();
}
ClassRecordingController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cr, req, res, next);
};
ClassRecordingController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cr, req, res, next);
};
ClassRecordingController.prototype.create = function (req, res, next) {
    controllerUtil.create(cr, req, res, next);
};
ClassRecordingController.prototype.update = function (req, res, next) {
    controllerUtil.update(cr, req, res, next);
};
ClassRecordingController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cr, req, res, next);
};
module.exports = ClassRecordingController;

