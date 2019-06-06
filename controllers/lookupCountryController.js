var LookupCountryModel = require('../models/mysqlModels/lookupCountryModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    lkm;
function LookupCountryController() {
    lkm = new LookupCountryModel();
    controllerUtil = new CommonController();
}
LookupCountryController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit < 0){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    } else {
        req.query.sort = req.query.sort ? req.query.sort : (req.query.start || req.query.end || req.query.limit || req.query.page) ? req.query.sort = "short_name" : '';
        controllerUtil.get(lkm, req, res, next);
    }
};
LookupCountryController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lkm, req, res, next);
};
LookupCountryController.prototype.create = function (req, res, next) {
    controllerUtil.create(lkm, req, res, next);
};
LookupCountryController.prototype.update = function (req, res, next) {
    controllerUtil.update(lkm, req, res, next);
};
LookupCountryController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lkm, req, res, next);
};

module.exports = LookupCountryController;

