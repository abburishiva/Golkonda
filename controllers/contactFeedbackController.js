var ContactFeedbackModel = require('../models/mysqlModels/contactFeedbackModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cfm;
function ContactFeedbackController() {
    cfm = new ContactFeedbackModel();
    controllerUtil = new CommonController();
}
ContactFeedbackController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cfm, req, res, next);
};
ContactFeedbackController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cfm, req, res, next);
};
ContactFeedbackController.prototype.create = function (req, res, next) {
    controllerUtil.create(cfm, req, res, next);
};
ContactFeedbackController.prototype.update = function (req, res, next) {
    controllerUtil.update(cfm, req, res, next);
};
ContactFeedbackController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cfm, req, res, next);
};

module.exports = ContactFeedbackController;

