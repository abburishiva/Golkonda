var UserLoginHistoryModel = require('../models/mysqlModels/userLoginHistoryModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ulh;
function UserLoginHistoryController() {
    ulh = new UserLoginHistoryModel();
    controllerUtil = new CommonController();
}
UserLoginHistoryController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ulh, req, res, next);
};
UserLoginHistoryController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ulh, req, res, next);
};
UserLoginHistoryController.prototype.create = function (req, res, next) {
    controllerUtil.create(ulh, req, res, next);
};
UserLoginHistoryController.prototype.update = function (req, res, next) {
    controllerUtil.update(ulh, req, res, next);
};
UserLoginHistoryController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ulh, req, res, next);
};
module.exports = UserLoginHistoryController;

