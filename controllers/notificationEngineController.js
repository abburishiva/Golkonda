var NotificationEngineModel = require('../models/mysqlModels/notificationEngineModel'),
    model;

function NotificationEngineController() {
    model = new NotificationEngineModel();
}
NotificationEngineController.prototype.create = function (req, res) {
    model.sendPush(req.body, function (err, data) {
        if (err) {
            res.status(err.code).send(err);
        } else {
            res.status(data.code).send(req.body);
        }
    });
};
NotificationEngineController.prototype.unSubscribe = function (req, res) {
    model.unSubscribeUser(req.body, function (err, data) {
        if (err) {
            res.status(err.code).send(err);
        } else {
            res.status(data.code).send(data);
        }
    });
};
module.exports = NotificationEngineController;
