var CommonEntityModel = require('../models/mysqlModels/commonEntityModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    ce;
function CommonEntityController() {
    ce = new CommonEntityModel();
    controllerUtil = new CommonController();
}
CommonEntityController.prototype.getAll = function (req, res, next) {
    if(req && req.query && !req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else{
        req.query.sort = req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(ce, req, res, next);
    }
};
CommonEntityController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ce, req, res, next);
};
CommonEntityController.prototype.create = function (req, res, next) {
    controllerUtil.create(ce, req, res, next);
};
CommonEntityController.prototype.update = function (req, res, next) {
    controllerUtil.update(ce, req, res, next);
};
CommonEntityController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ce, req, res, next);
};

module.exports = CommonEntityController;