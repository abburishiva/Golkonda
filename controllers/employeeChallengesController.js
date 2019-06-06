var EmployerChallengesModel = require('../models/mongoModels/employeeChallengesModel'),
    CommonController = require('../utils/controllerUtil'),
    ecm,
    controllerUtil;

function EmployerChallengesController() {
    ecm = new EmployerChallengesModel();
    controllerUtil = new CommonController();
}
EmployerChallengesController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ecm, req, res, next);
};
EmployerChallengesController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ecm, req, res, next);
};
EmployerChallengesController.prototype.create = function (req, res, next) {
    controllerUtil.create(ecm, req, res, next);
};
EmployerChallengesController.prototype.update = function (req, res, next) {
    controllerUtil.update(ecm, req, res, next);
};
EmployerChallengesController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ecm, req, res, next);
};
module.exports = EmployerChallengesController;
