var LookupCurrenciesModel = require('../models/mysqlModels/lookupCurrenciesModel.js'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    led;
function LookupCurrenciesController() {
    led = new LookupCurrenciesModel();
    controllerUtil = new CommonController();
}
LookupCurrenciesController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Bad Request'});
    } else{
        controllerUtil.get(led, req, res, next);
    }
};
LookupCurrenciesController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(led, req, res, next);
};
LookupCurrenciesController.prototype.create = function (req, res, next) {
    controllerUtil.create(led, req, res, next);
};
LookupCurrenciesController.prototype.update = function (req, res, next) {
    controllerUtil.update(led, req, res, next);
};
LookupCurrenciesController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(led, req, res, next);
};

module.exports = LookupCurrenciesController;