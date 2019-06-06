var newsLetterModel = require('../models/mongoModels/newsLetterModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerutil,
    nm;

function NewsLetterController() {
    nm = new newsLetterModel();
    controllerutil = new CommonController();
}

NewsLetterController.prototype.getAll = function (req, res, next) {
    controllerutil.get(nm, req, res, next);
};

NewsLetterController.prototype.getById = function (req, res, next) {
    controllerutil.getById(nm, req, res, next);
};

NewsLetterController.prototype.create = function (req, res, next) {
    controllerutil.create(nm, req, res, next);
};

NewsLetterController.prototype.update = function (req, res, next) {
    controllerutil.update(nm, req, res, next);
};

NewsLetterController.prototype.remove = function (req, res, next) {
    controllerutil.remove(nm, req, res, next);
};

module.exports = NewsLetterController;