var firebase = require('../../utils/firebaseConnections'),
    connections = require('../../config/default.json'),
    ZmqUtility = require('../../utils/zmq/zmqUtility'),
    Logger = require('../../utils/winston/logModule'),
    CandidateModel = require('../mongoModels/candidateModel'),
    _ = require("lodash"),
    cModel,
    log;

function NotificationEngineModel() {
    log = new Logger();
    this.utility = new ZmqUtility();
    cModel = new CandidateModel();
    log.info("this is NotificationEngineModel constructor ");
}
NotificationEngineModel.prototype.sendPush = function (data, callback) {
    var pushData = _.pick(data, ['message', 'from', 'to', 'redirect_url', 'image_url', 'subscription', 'icon', 'title', 'name', 'sound', 'isMessage', 'debug', 'resumeID']);
    log.info("pushData", pushData);
    if (pushData.message && pushData.to) {
        this.utility.pub('pushEngine', pushData);
        log.info("Sending data to service ", pushData);
        callback(null, {code: 200, message: "success"});
    } else if (pushData.message && pushData.resumeID) {
        var util = this.utility;
        cModel.find(pushData, function (err, data) {
            if(data &&  data.user_profile &&  data.user_profile.email){
                pushData.to = data.user_profile.email;
                util.pub('pushEngine', pushData);
                callback(null, {code: 200, message: "success"});
            }else{
                callback({code: 406, message: "required fields"});
            }
        });
    } else {
        log.info("{code: 406, message: required fields}");
        callback({code: 406, message: "required fields"});
    }
};
NotificationEngineModel.prototype.unSubscribeUser = function (data, callback) {
    log.info("this is unSubscribeUser function ", data);
    var count = 0, delData = _.pick(data, ['to', 'endpoint']),
        selected = [];
    if (delData.to && Array.isArray(delData.to)) {
        delData.to.forEach(function (value, key) {
            firebase.subscriptions.orderByChild('email').equalTo(value).once("value", function (data) {
                if (data.val()) {
                    var values = _.pick(data.val()[Object.keys(data.val())[0]], ['key', 'email']);
                    selected.push(values.key);
                }
            });
        });
        setTimeout(function () {
            if (selected && selected.length !== 0) {
                selected.forEach(function (value) {
                    count = +1;
                    firebase.subscriptions.child(value).remove();
                    if (selected.length === count) {
                        callback(null, {code: 200, message: "successfully deleted users"});
                        log.info("{code: 200, message: successfully deleted users} ");
                    }
                });
            }
        }, 5000);
    } else if (delData.to && typeof delData.to === 'string') {
        deleteUser(delData.to, function (err, deleted) {
            if (!err) {
                callback(null, {code: 200, message: "successfully deleted user"});
                log.info("{code: 200, message: successfully deleted user} ");
            } else {
                callback(err, null);
                log.error("while calling deleteUser function ", err);
            }
        });
    } else {
        callback({code: 406, message: "required fields"}, null);
        log.info("{code: 406, message: required fields} ");
    }
};
function deleteUser(email, callback) {
    log.info("deleteUser function ");
    firebase.subscriptions.orderByChild('email').equalTo(email).once("value", function (data) {
        if (data.val()) {
            var key = data.val()[Object.keys(data.val())[0]].key;
            firebase.subscriptions.child(key).remove(function (err, reply) {
                if (err) {
                    callback({code: 500, message: "bad request"}, reply);
                    log.error("while removing user from firebase", err);
                } else {
                    callback(null, reply);
                    log.info("else excuting in while deleting user", reply);
                }
            });
        } else {
            callback({code: 404, message: "not found"}, null);
            log.info("{code: 404, message: not found} ");
        }
    });
}
module.exports = NotificationEngineModel;
