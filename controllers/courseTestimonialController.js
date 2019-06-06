var CourseTestimonialModel = require('../models/mysqlModels/courseTestimonialModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ctm;
function CourseTestimonialController() {
    ctm = new CourseTestimonialModel();
    controllerUtil = new CommonController();
}
CourseTestimonialController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ctm, req, res, next);
};
CourseTestimonialController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ctm, req, res, next);
};
CourseTestimonialController.prototype.create = function (req, res, next) {
    controllerUtil.create(ctm, req, res, next);
};
CourseTestimonialController.prototype.update = function (req, res, next) {
    controllerUtil.update(ctm, req, res, next);
};
CourseTestimonialController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ctm, req, res, next);
};
module.exports = CourseTestimonialController;




