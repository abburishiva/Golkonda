var CommonController = require('../utils/controllerUtil'),
    QuizzesModel = require('../models/mysqlModels/quizzesModel'),
    cc, qm;

function QuizzesController() {
    qm = new QuizzesModel();
    cc = new CommonController();
}

QuizzesController.prototype.getAll = function (req, res, next) {
    cc.get(qm, req, res, next);
};

module.exports = QuizzesController;
