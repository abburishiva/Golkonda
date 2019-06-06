var LookupWorkStatusModel = require('../models/mysqlModels/lookupWorkStatusModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    lws;
function LookupWorkStatusController() {
    lws = new LookupWorkStatusModel();
    controllerUtil = new CommonController();
}
LookupWorkStatusController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    } else if(req && req.query && req.query.limit < 0){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    } else {
        req.query.sort = req.query.sort ? req.query.sort : (req.query.start || req.query.end || req.query.limit || req.query.page) ? req.query.sort = "name" : '';
        controllerUtil.get(lws, req, res, next);
    }
};
LookupWorkStatusController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lws, req, res, next);
};
LookupWorkStatusController.prototype.create = function (req, res, next) {
    controllerUtil.create(lws, req, res, next);
};
LookupWorkStatusController.prototype.update = function (req, res, next) {
    controllerUtil.update(lws, req, res, next);
};
LookupWorkStatusController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lws, req, res, next);
};
module.exports = LookupWorkStatusController;




