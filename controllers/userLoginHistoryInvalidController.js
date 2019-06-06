var UserLoginHistoryInvalidModel = require('../models/mysqlModels/userLoginHistoryInvalidModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ulhim;
function UserLoginHistoryInvalidController() {
    ulhim = new UserLoginHistoryInvalidModel();
    controllerUtil = new CommonController();
}
UserLoginHistoryInvalidController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ulhim, req, res, next);
};
UserLoginHistoryInvalidController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ulhim, req, res, next);
};
UserLoginHistoryInvalidController.prototype.create = function (req, res, next) {
    controllerUtil.create(ulhim, req, res, next);
};
UserLoginHistoryInvalidController.prototype.update = function (req, res, next) {
    controllerUtil.update(ulhim, req, res, next);
};
UserLoginHistoryInvalidController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ulhim, req, res, next);
};
UserLoginHistoryInvalidController.prototype.search = function (req, res, next) {
    controllerUtil.search(ulhim, req, res, next);
};
module.exports = UserLoginHistoryInvalidController;