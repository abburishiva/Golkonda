var UserLoginGithubModel = require('../models/mysqlModels/userLoginGithubModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ulg;
function UserLoginGithubController() {
    ulg = new UserLoginGithubModel();
    controllerUtil = new CommonController();
}
UserLoginGithubController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ulg, req, res, next);
};
UserLoginGithubController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ulg, req, res, next);
};
UserLoginGithubController.prototype.create = function (req, res, next) {
    controllerUtil.create(ulg, req, res, next);
};
UserLoginGithubController.prototype.update = function (req, res, next) {
    controllerUtil.update(ulg, req, res, next);
};
UserLoginGithubController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ulg, req, res, next);
};
module.exports = UserLoginGithubController;

