var LookupDesignatiosModel = require('../models/mysqlModels/lookupDesignationsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    led;
function LookupDesignationsController() {
    led = new LookupDesignatiosModel();
    controllerUtil = new CommonController();
}
LookupDesignationsController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }
    else{
        req.query.order = req.query.order ? req.query.order : req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(led, req, res, next);
    }
};
LookupDesignationsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(led, req, res, next);
};
LookupDesignationsController.prototype.create = function (req, res, next) {
    controllerUtil.create(led, req, res, next);
};
LookupDesignationsController.prototype.update = function (req, res, next) {
    controllerUtil.update(led, req, res, next);
};
LookupDesignationsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(led, req, res, next);
};

module.exports = LookupDesignationsController;


