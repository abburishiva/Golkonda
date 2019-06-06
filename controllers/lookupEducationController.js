var LookupEducationModel = require('../models/mysqlModels/lookupEducationModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    lem;
function LookupEducationController() {
    lem = new LookupEducationModel();
    controllerUtil = new CommonController();
}
LookupEducationController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit < 0){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    } else {
        req.query.sort = req.query.sort ? req.query.sort : (req.query.start || req.query.end || req.query.limit || req.query.page) ? req.query.sort = "name" : '';
        controllerUtil.get(lem, req, res, next);
    }
};
LookupEducationController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lem, req, res, next);
};
LookupEducationController.prototype.create = function (req, res, next) {
    controllerUtil.create(lem, req, res, next);
};
LookupEducationController.prototype.update = function (req, res, next) {
    controllerUtil.update(lem, req, res, next);
};
LookupEducationController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lem, req, res, next);
};
module.exports = LookupEducationController;

