var UserLoginFacebookModel = require('../models/mysqlModels/userLoginFacebookModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ulfm;
function UserLoginFacebookController() {
    controllerUtil = new CommonController();
    ulfm = new UserLoginFacebookModel();
}
UserLoginFacebookController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ulfm, req, res, next);
};
UserLoginFacebookController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ulfm, req, res, next);
};
UserLoginFacebookController.prototype.create = function (req, res, next) {
    controllerUtil.create(ulfm, req, res, next);
};
UserLoginFacebookController.prototype.update = function (req, res, next) {
    controllerUtil.update(ulfm, req, res, next);
};
UserLoginFacebookController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ulfm, req, res, next);
};
module.exports = UserLoginFacebookController;

