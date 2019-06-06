var FirebaseNotificationModel = require('../models/firebaseNotificationModel'),
    Logger = require('../utils/winston/logModule'),
    log;
function FirebaseNotificationController() {
    this.fnm = new FirebaseNotificationModel();
    log = new Logger();
}
FirebaseNotificationController.prototype.createSubscription = function (req, res, next) {
    log.info("createSubscription controller");
    this.fnm.createSubscription(req.body, function (err, result) {
        if (err) {
            res.status(500).json({message: 'Internal server error'});
        } else {
            res.status(201).json({message: 'Record created successfully'});
        }
    })
}
FirebaseNotificationController.prototype.addReminder = function (req, res, next) {
    log.info("addReminder controller");
    this.fnm.addReminder(req.body, function (err, result) {
        if (err) {
            res.status(500).json({message: 'Internal server error'});
        } else {
            res.status(201).json({message: 'Record created successfully'});
        }
    })
}
FirebaseNotificationController.prototype.sendNotification = function (req, res, next) {
    log.info("sendNotification controller");
    this.fnm.sendNotification(req.body, function (err, result) {
        if (err) {
            res.status(500).json({message: 'Internal server error'});
        } else {
            res.status(201).json({message: 'Record created successfully'});
        }
    })
}
FirebaseNotificationController.prototype.updateNotification = function (req, res, next) {
    log.info("updateNotification controller");
    this.fnm.updateNotification(req.query.id,req.body, function (err, result) {
        if (err) {
            res.status(500).json({message: 'Internal server error'});
        } else {
            res.status(201).json({message: 'Record created successfully'});
        }
    })
}
FirebaseNotificationController.prototype.deleteNotification = function (req,res, next) {
    log.info("deleteNotification controller");
    this.fnm.deleteNotification(req.query.id, function (err, result) {
        if (err) {
            res.status(404).send(JSON.stringify({
                message: err.message
            }));
        } else {
            res.status(204).send(JSON.stringify({
                message: result.message
            }))
        }
    })
}
module.exports = FirebaseNotificationController;
