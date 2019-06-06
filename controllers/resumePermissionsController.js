var ResumePermissionModel = require('../models/mongoModels/resumePermissionsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    rpm;
function ResumePermmissionController() {
    rpm = new ResumePermissionModel();
    controllerUtil = new CommonController();
}
ResumePermmissionController.prototype.getAll = function (req, res, next) {
    if (req.baseUrl === '/v1/resume/permissions' && req.url.indexOf('email/permissions') > 0) {
        req.query.type = 'emailPermissions';
    }
    controllerUtil.get(rpm, req, res, next);
};
ResumePermmissionController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(rpm, req, res, next);
};
ResumePermmissionController.prototype.create = function (req, res, next) {
    controllerUtil.create(rpm, req, res, next);
};
ResumePermmissionController.prototype.update = function (req, res, next) {
    controllerUtil.update(rpm, req, res, next);
};
ResumePermmissionController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(rpm, req, res, next);
};
module.exports = ResumePermmissionController;




