var UserLoginGoogleModel = require('../models/mysqlModels/userLoginGoogleModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ulgm;
function UserLoginGoogleController() {
    controllerUtil = new CommonController();
    ulgm = new UserLoginGoogleModel();
}
UserLoginGoogleController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ulgm, req, res, next);
};
UserLoginGoogleController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ulgm, req, res, next);
};
UserLoginGoogleController.prototype.create = function (req, res, next) {
    controllerUtil.create(ulgm, req, res, next);
};
UserLoginGoogleController.prototype.update = function (req, res, next) {
    controllerUtil.update(ulgm, req, res, next);
};
UserLoginGoogleController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ulgm, req, res, next);
};

module.exports = UserLoginGoogleController;

