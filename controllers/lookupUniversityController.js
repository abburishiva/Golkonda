var LookupUniversityModel = require('../models/mongoModels/lookupUniversityModel'),
    CommonController = require('../utils/controllerUtil'),
    lu,
    controllerUtil;

function LookupUniversityController() {
    lu = new LookupUniversityModel();
    controllerUtil = new CommonController();
}

LookupUniversityController.prototype.getAll = function (req, res, next) {
    if(!req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }
    else {
        req.query.order = req.query.order ? req.query.order : req.query.sort ? req.query.sort : (req.query.start || req.query.end || req.query.limit || req.query.page) ? req.query.sort = "name" : '';
        controllerUtil.get(lu, req, res, next);
    }
};

LookupUniversityController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(lu, req, res, next);
};

LookupUniversityController.prototype.create = function (req, res, next) {
    controllerUtil.create(lu, req, res, next);
};

LookupUniversityController.prototype.update = function (req, res, next) {
    controllerUtil.update(lu, req, res, next);
};

LookupUniversityController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(lu, req, res, next);
};

module.exports = LookupUniversityController;

