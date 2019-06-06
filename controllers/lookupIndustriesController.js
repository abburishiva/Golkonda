var LookupIndustriesModel = require('../models/mysqlModels/lookupIndustriesModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    lim;
function LookupIndustriesController() {
    lim = new LookupIndustriesModel();
    controllerUtil = new CommonController();
}
LookupIndustriesController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }
    else{
        req.query.order = req.query.order ? req.query.order : req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(lim, req, res, next);
    }
};
LookupIndustriesController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lim, req, res, next);
};
LookupIndustriesController.prototype.create = function (req, res, next) {
    controllerUtil.create(lim, req, res, next);
};
LookupIndustriesController.prototype.update = function (req, res, next) {
    controllerUtil.update(lim, req, res, next);
};
LookupIndustriesController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lim, req, res, next);
};

module.exports = LookupIndustriesController;


