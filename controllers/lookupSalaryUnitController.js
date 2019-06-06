'use strict';
var LookupSalaryUnitModel = require('../models/mysqlModels/lookupSalaryUnitModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    les;
function LookupSalaryUnitController() {
    les = new LookupSalaryUnitModel();
    controllerUtil = new CommonController();
}
LookupSalaryUnitController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Bad Request'});
    }
    else{
        req.query.sort = req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(les, req, res, next);
    }
};
LookupSalaryUnitController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(les, req, res, next);
};
LookupSalaryUnitController.prototype.create = function (req, res, next) {
    controllerUtil.create(les, req, res, next);
};
LookupSalaryUnitController.prototype.update = function (req, res, next) {
    controllerUtil.update(les, req, res, next);
};
LookupSalaryUnitController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(les, req, res, next);
};
module.exports = LookupSalaryUnitController;



