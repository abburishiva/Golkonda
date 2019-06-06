var OrganizationsModel = require('../models/organizationsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    om;

function OrganizationsController() {
    om = new OrganizationsModel();
    controllerUtil = new CommonController();
}

OrganizationsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(om, req, res, next);
};
OrganizationsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(om, req, res, next);
};
OrganizationsController.prototype.create = function (req, res, next) {
    controllerUtil.create(om, req, res, next);
};
OrganizationsController.prototype.update = function (req, res, next) {
    controllerUtil.update(om, req, res, next);
};
OrganizationsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(om, req, res, next);
};
module.exports = OrganizationsController;

