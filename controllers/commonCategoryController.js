var CommonCategoryModel = require('../models/mysqlModels/commonCategoryModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cc;
function CommonCategoryController() {
    cc = new CommonCategoryModel();
    controllerUtil = new CommonController();
}
CommonCategoryController.prototype.getAll = function (req, res, next) {
    if(req && req.query && !req.query.limit && !req.query.end){
        res.status(400).json({status: 400, message: 'Limit is Mandatory'});
    }else if(req && req.query && req.query.limit <= 0 || req.query.end <= 0 || isNaN(req.query.limit) && isNaN(req.query.end)){
        res.status(400).json({status: 400, message: 'please provide Limit grater than zero'});
    }
    else{
        req.query.sort = req.query.sort?req.query.sort:(req.query.start || req.query.end || req.query.limit || req.query.page)?req.query.sort = "name":'';
        controllerUtil.get(cc, req, res, next);
    }
};
CommonCategoryController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cc, req, res, next);
};
CommonCategoryController.prototype.create = function (req, res, next) {
    controllerUtil.create(cc, req, res, next);
};
CommonCategoryController.prototype.update = function (req, res, next) {
    controllerUtil.update(cc, req, res, next);
};
CommonCategoryController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cc, req, res, next);
};
module.exports = CommonCategoryController;

