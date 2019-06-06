var categoriesModel = require('../models/categoriesModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    cm;

function CategoriesController() {
    cm = new categoriesModel();
    controllerUtil = new CommonController();
}

CategoriesController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cm, req, res, next);
}

module.exports = CategoriesController;