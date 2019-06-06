var AppEmployerContact = require('../models/mysqlModels/appEmployerContactModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    aecm;
function AppEmployerContactController() {
    aecm = new AppEmployerContact();
    controllerUtil = new CommonController();
}
AppEmployerContactController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(aecm, req, res, next);
};

AppEmployerContactController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(aecm, req, res, next);
};

AppEmployerContactController.prototype.create = function (req, res, next) {
    controllerUtil.create(aecm, req, res, next);
};

AppEmployerContactController.prototype.update = function (req, res, next) {
    controllerUtil.update(aecm, req, res, next);
};

AppEmployerContactController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(aecm, req, res, next);
};

module.exports = AppEmployerContactController;




