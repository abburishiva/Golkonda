var ResumeRequestModel = require('../models/mongoModels/resumeRequestsModel.js'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    rrm;
function ResumeRequestController() {
    rrm = new ResumeRequestModel();
    controllerUtil = new CommonController();
}
ResumeRequestController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(rrm, req, res, next);
};
ResumeRequestController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(rrm, req, res, next);
};
ResumeRequestController.prototype.create = function (req, res, next) {
    controllerUtil.create(rrm, req, res, next);
};
ResumeRequestController.prototype.update = function (req, res, next) {
    controllerUtil.update(rrm, req, res, next);
};
ResumeRequestController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(rrm, req, res, next);
};
module.exports = ResumeRequestController;


