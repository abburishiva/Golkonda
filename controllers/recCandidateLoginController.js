var RecCandidateLoginModel = require('../models/mysqlModels/recCandidateLoginModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    aum;
function RecCandidateLoginController() {
    aum = new RecCandidateLoginModel();
    controllerUtil = new CommonController();
}
RecCandidateLoginController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(aum, req, res, next);
};
RecCandidateLoginController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(aum, req, res, next);
};
RecCandidateLoginController.prototype.create = function (req, res, next) {
    controllerUtil.create(aum, req, res, next);
};
RecCandidateLoginController.prototype.update = function (req, res, next) {
    controllerUtil.update(aum, req, res, next);
};
RecCandidateLoginController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(aum, req, res, next);
};

module.exports = RecCandidateLoginController;

