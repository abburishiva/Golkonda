var skillsModel = require('../models/skillsModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    sm;
function skillsController() {
    sm = new skillsModel();
    controllerUtil = new CommonController;
}

skillsController.prototype.getAll = function (req, res, next) {
    if(req && req.query && !req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit && req.query.limit <= 0 || req.query.end <= 0 || isNaN(req.query.limit) && isNaN(req.query.end)){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    }
    else {
        controllerUtil.get(sm, req, res, next);
    }
};
skillsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(sm, req, res, next);
};
skillsController.prototype.create = function (req, res, next) {
    controllerUtil.create(sm, req, res, next);
};
skillsController.prototype.update = function (req, res, next) {
    controllerUtil.update(sm, req, res, next);
};
skillsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(sm, req, res, next);
};
module.exports = skillsController;


