var firebase = require('./../utils/firebaseConnections'),
    Logger = require('./../utils/winston/logModule'),
    count = 0,
    log;
function FirebaseNotificationModel() {
    log = new Logger();
}
FirebaseNotificationModel.prototype.createSubscription = function (subscriptionData, callback) {
    log.info("createSubscription from model");
    firebase.subscriptions.orderByChild("key").equalTo(subscriptionData.key).once("value", function(data){
        if(data.val()){
            var keys = Object.keys(data.val());
            if (keys.length > 0 && keys[0]) {
                log.info("key", keys[0]);
                var updates = {};
                updates[keys[0]] = subscriptionData;
                firebase.subscriptions.update(updates,function (err, val) {
                    if (err) {
                        callback(val);
                    } else {
                        callback(err);
                    }
                });
            }
        } else {
            firebase.subscriptions.push(subscriptionData,function (err, val) {
                if (err) {
                    callback(val);
                } else {
                    callback(err);
                }
            });
        }

    });
};
FirebaseNotificationModel.prototype.addReminder = function (reminderData, callback) {
    log.info("addReminder from model");
    var updates = {};
    updates[reminderData.interviews_id] = reminderData;
    firebase.reminderNotifications.update(updates,function (err, val) {
        if (err) {
            callback(err);
        } else {
            callback(val);
        }
    });
};
FirebaseNotificationModel.prototype.sendNotification = function (notificationData, callback) {
    log.info("sendNotification from model");
    var notification = {};
    notification[(new Date()).valueOf()] = notificationData;
    firebase.onSiteNotifications.update(notification,function (err, val) {
        if (err) {
            callback(err);
        } else {
            callback(val);
        }
    });
};
FirebaseNotificationModel.prototype.updateNotification = function (id,notificationData, callback) {
    log.info("updateNotification from model");
    firebase.onSiteNotifications.child(id).update(notificationData,function (err, val) {
        if (err) {
            callback(err);
        } else {
            callback(val);
        }
    });
};
FirebaseNotificationModel.prototype.deleteNotification = function (id, callback) {
    log.info("deleteNotification from model");
    firebase.onSiteNotifications.child(id).remove(function (err, val) {
        if (err) {
            callback({message: "not found"}, null);
        } else {
            callback(null, {code: 204, message: "resource(s) deleted."});
        }
    });
};

module.exports = FirebaseNotificationModel;
