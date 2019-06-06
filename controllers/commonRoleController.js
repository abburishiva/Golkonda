var CommonRoleModel = require('../models/mysqlModels/commonRoleModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cr;
function CommonRoleController() {
    cr = new CommonRoleModel();
    controllerUtil = new CommonController();
}
CommonRoleController.prototype.getAll = function (req, res, next) {
    if(req && req.query && !req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit <= 0){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    }
    else{
        req.query.sort = req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(cr, req, res, next);
    }
};
CommonRoleController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cr, req, res, next);
};
CommonRoleController.prototype.create = function (req, res, next) {
    controllerUtil.create(cr, req, res, next);
};
CommonRoleController.prototype.update = function (req, res, next) {
    controllerUtil.update(cr, req, res, next);
};
CommonRoleController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cr, req, res, next);
};
module.exports = CommonRoleController;