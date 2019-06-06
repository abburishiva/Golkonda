var RecordingslistBackupModel = require('../models/mysqlModels/recordingslistBackupModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    rlbm;
function RecordingslistBackupController() {
    rlbm = new RecordingslistBackupModel();
    controllerUtil = new CommonController();
}
RecordingslistBackupController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(rlbm, req, res, next);
};
RecordingslistBackupController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(rlbm, req, res, next);
};
RecordingslistBackupController.prototype.create = function (req, res, next) {
    controllerUtil.create(rlbm, req, res, next);
};
RecordingslistBackupController.prototype.update = function (req, res, next) {
    controllerUtil.update(rlbm, req, res, next);
};
RecordingslistBackupController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(rlbm, req, res, next);
};
module.exports = RecordingslistBackupController;

