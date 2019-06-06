var CommonTypeModel = require('../models/mysqlModels/commonTypeModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ct;
function CommonTypeController() {
    ct = new CommonTypeModel();
    controllerUtil = new CommonController();
}
CommonTypeController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req.query.limit < 0){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    }
    else{
        req.query.sort = req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(ct, req, res, next);
    }
};
CommonTypeController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ct, req, res, next);
};
CommonTypeController.prototype.create = function (req, res, next) {
    controllerUtil.create(ct, req, res, next);
};
CommonTypeController.prototype.update = function (req, res, next) {
    controllerUtil.update(ct, req, res, next);
};
CommonTypeController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ct, req, res, next);
};
module.exports = CommonTypeController;

