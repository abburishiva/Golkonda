var UserLoginLinkedinModel = require('../models/mysqlModels/userLoginLinkedinModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ullm;
function UserLoginLinkedinController() {
    ullm = new UserLoginLinkedinModel();
    controllerUtil = new CommonController();
}
UserLoginLinkedinController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ullm, req, res, next);
};
UserLoginLinkedinController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ullm, req, res, next);
};
UserLoginLinkedinController.prototype.create = function (req, res, next) {
    controllerUtil.create(ullm, req, res, next);
};
UserLoginLinkedinController.prototype.update = function (req, res, next) {
    controllerUtil.update(ullm, req, res, next);
};
UserLoginLinkedinController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ullm, req, res, next);
};

module.exports = UserLoginLinkedinController;



