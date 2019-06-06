var UserLoginModel = require('../models/mysqlModels/userLoginModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ul;
function UserLoginController() {
    ul = new UserLoginModel();
    controllerUtil = new CommonController();
}
UserLoginController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ul, req, res, next);
};
UserLoginController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ul, req, res, next);
};
UserLoginController.prototype.create = function (req, res, next) {
    controllerUtil.create(ul, req, res, next);
};
UserLoginController.prototype.update = function (req, res, next) {
    controllerUtil.update(ul, req, res, next);
};
UserLoginController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ul, req, res, next);
};
UserLoginController.prototype.search = function (req, res, next) {
    controllerUtil.search(ul, req, res, next);
};
module.exports = UserLoginController;