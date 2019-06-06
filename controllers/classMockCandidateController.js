var ClassMockCandidateModel = require('../models/mysqlModels/classMockCandidateModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cmc;
function ClassMockCandidateController() {
    cmc = new ClassMockCandidateModel();
    controllerUtil = new CommonController();
}
ClassMockCandidateController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cmc, req, res, next);
};
ClassMockCandidateController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cmc, req, res, next);
};
ClassMockCandidateController.prototype.create = function (req, res, next) {
    controllerUtil.create(cmc, req, res, next);
};
ClassMockCandidateController.prototype.update = function (req, res, next) {
    controllerUtil.update(cmc, req, res, next);
};
ClassMockCandidateController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cmc, req, res, next);
};
ClassMockCandidateController.prototype.search = function (req, res, next) {
    controllerUtil.search(cmc, req, res, next);
};

module.exports = ClassMockCandidateController;