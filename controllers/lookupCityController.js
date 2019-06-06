var LookupCityModel = require('../models/mysqlModels/lookupCityModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    lcm;
function LookupCityController() {
    lcm = new LookupCityModel();
    controllerUtil = new CommonController();
}
LookupCityController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit < 0){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    } else {
        req.query.sort = req.query.sort ? req.query.sort : (req.query.start || req.query.end || req.query.limit || req.query.page) ? req.query.sort = "name" : '';
        controllerUtil.get(lcm, req, res, next);
    }
};
LookupCityController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lcm, req, res, next);
};
LookupCityController.prototype.create = function (req, res, next) {
    controllerUtil.create(lcm, req, res, next);
};
LookupCityController.prototype.update = function (req, res, next) {
    controllerUtil.update(lcm, req, res, next);
};
LookupCityController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lcm, req, res, next);
};
module.exports = LookupCityController;

