var CommonPaperworkModel = require('../models/mysqlModels/commonPaperworkModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cpw;
function CommonPaperworkController() {
    cpw = new CommonPaperworkModel();
    controllerUtil = new CommonController();
}
CommonPaperworkController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cpw, req, res, next);
};
CommonPaperworkController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cpw, req, res, next);
};
CommonPaperworkController.prototype.create = function (req, res, next) {
    controllerUtil.create(cpw, req, res, next);
};
CommonPaperworkController.prototype.update = function (req, res, next) {
    controllerUtil.update(cpw, req, res, next);
};
CommonPaperworkController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cpw, req, res, next);
};

module.exports = CommonPaperworkController;

