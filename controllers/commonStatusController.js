var CommonStatusModel = require('../models/mysqlModels/commonStatusModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cs;
function CommonStatusController() {
    cs = new CommonStatusModel();
    controllerUtil = new CommonController();
}
CommonStatusController.prototype.getAll = function (req, res, next) {
    if(req && req.query && !req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit <= 0 || req.query.end <= 0 || isNaN(req.query.limit) && isNaN(req.query.end)){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    }
    else{
        req.query.sort = req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(cs, req, res, next);
    }
};
CommonStatusController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cs, req, res, next);
};
CommonStatusController.prototype.create = function (req, res, next) {
    controllerUtil.create(cs, req, res, next);
};
CommonStatusController.prototype.update = function (req, res, next) {
    controllerUtil.update(cs, req, res, next);
};
CommonStatusController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cs, req, res, next);
};
module.exports = CommonStatusController;

