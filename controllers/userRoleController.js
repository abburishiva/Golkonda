var UserRoleModel = require('../models/mysqlModels/userRoleModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ur;
function UserRoleController() {
    ur = new UserRoleModel();
    controllerUtil = new CommonController();
}
UserRoleController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ur, req, res, next);
};
UserRoleController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ur, req, res, next);
};
UserRoleController.prototype.create = function (req, res, next) {
    controllerUtil.create(ur, req, res, next);
};
UserRoleController.prototype.update = function (req, res, next) {
    controllerUtil.update(ur, req, res, next);
};
UserRoleController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ur, req, res, next);
};

module.exports = UserRoleController;

