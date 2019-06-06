'use strict';
var LookupCountryCurrenciesModel = require('../models/mysqlModels/lookupCountryCurrenciesModel.js'),
    CommonController = require('../utils/controllerUtil'),
    Logger = require('../utils/winston/logModule'),
    controllerUtil,
    lcc,
    log;

function LookupCountryCurrenciesController() {
    lcc = new LookupCountryCurrenciesModel();
    controllerUtil = new CommonController();
    log = new Logger();
    log.info("This is LookupCountryCurrenciesController Constructor...");
}

LookupCountryCurrenciesController.prototype.getAll = function (req, res, next) {
    if (!req.query.limit && !req.query.end) {
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }
    else {
        req.query.sort = req.query.sort ? req.query.sort : (req.query.start || req.query.end || req.query.limit || req.query.page) ? req.query.sort = "country" : '';
        controllerUtil.get(lcc, req, res, next);
    }
}
module.exports = LookupCountryCurrenciesController;