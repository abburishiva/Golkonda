var UserReviewModel = require('../models/mongoModels/userReviewsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    urm;

function UserReviewController() {
    urm = new UserReviewModel();
    controllerUtil = new CommonController();
}

UserReviewController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(urm, req, res, next);
};
UserReviewController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(urm, req, res, next);
};
UserReviewController.prototype.create = function (req, res, next) {
    controllerUtil.create(urm, req, res, next);
};
UserReviewController.prototype.update = function (req, res, next) {
    controllerUtil.update(urm, req, res, next);
};

UserReviewController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(urm, req, res, next);
};
module.exports = UserReviewController;

