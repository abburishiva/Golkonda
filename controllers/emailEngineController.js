var EmailEngineModel = require('../models/mysqlModels/emailEngineModel'),
    model;
function EmailEngineController() {
    model = new EmailEngineModel();
}
EmailEngineController.prototype.create = function (req, res) {
    model.sendMessage(req.body, function (err, data) {
        if (err) {
            res.status(err.code).send(err);
        } else {
            res.status(data.code).send(req.body);
        }
    });
};

module.exports = EmailEngineController;