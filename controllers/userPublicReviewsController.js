var UserReviewModel = require('../models/mongoModels/userReviewsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    reviews;

function UserPublicReviewsController() {
    reviews = new UserReviewModel();
    controllerUtil = new CommonController();
}
UserPublicReviewsController.prototype.get = function (req, res, next) {
    controllerUtil.get(reviews, req, res, next);
};
module.exports = UserPublicReviewsController;

