var zmq = require('zmq'),
    pull = zmq.socket("pull"),
    push = zmq.socket("push"),
    sub = zmq.socket("sub"),
    pub = zmq.socket("pub");
var config = require('config');
pull.connect(config.zmqConnections.pull);
push.bindSync(config.zmqConnections.push);
sub.connect(config.zmqConnections.sub);
pub.bindSync(config.zmqConnections.pub);
function ZmqUtility() {
}
ZmqUtility.prototype.pull = function (callback) {
    pull.on('message', function (msg) {
        callback(msg);
    });
};
ZmqUtility.prototype.push = function (data) {
    push.send(JSON.stringify(data));
};
ZmqUtility.prototype.pub = function (name, data) {
    pub.send([name, JSON.stringify(data)]);
};
ZmqUtility.prototype.sub = function (callback) {
    sub.on('message', function (topic, message) {
        callback(message);
    });
};
module.exports = ZmqUtility;