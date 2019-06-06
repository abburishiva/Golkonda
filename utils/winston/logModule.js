var log = require('./logger.js');
function LogMessageModule () {

}
LogMessageModule.prototype.error = function (req, err) {
    var logMessage = {};
    logMessage.timestamp = new Date().toUTCString();
    if (req) {
        logMessage.baseUrl = req.baseUrl;
        logMessage.rawHeaders = req.rawHeaders;
        logMessage._parsedUrl = req._parsedUrl;
        logMessage.requestMethod = req.method;
        logMessage.params = req.params;
        logMessage.headers = req.headers;
        logMessage.ip = req.ip;
        if (req.body) {
            logMessage.requestBody = req.body;
        }
        if (req.decoded) {
            logMessage.role = req.decoded.role;
            logMessage.isSuper = req.decoded.is_super;
            logMessage.reqUserId = req.decoded.id;
            logMessage.reqUserName = req.decoded.name;
        }
    }
    if (err) {
        logMessage.error = err;
    }
    log.error(logMessage);
};


LogMessageModule.prototype.info = function (msg,req) {
    var logMessage = {};
    logMessage.timestamp = new Date().toUTCString();
    if (req) {
        logMessage.baseUrl = req.baseUrl;
        logMessage.rawHeaders = req.rawHeaders;
        logMessage._parsedUrl = req._parsedUrl;
        logMessage.requestMethod = req.method;
        logMessage.params = req.params;
        logMessage.headers = req.headers;
        logMessage.ip = req.ip;
        if (req.body) {
            logMessage.requestBody = req.body;
        }
        if (req.decoded) {
            logMessage.role = req.decoded.role;
            logMessage.isSuper = req.decoded.is_super;
            logMessage.reqUserId = req.decoded.id;
            logMessage.reqUserName = req.decoded.name;
        }
    }
    logMessage.message = msg;
    log.info(logMessage);
};
LogMessageModule.prototype.debug = function (msg) {
    var logMessage = {};
    logMessage.timestamp = new Date().toUTCString();
    logMessage.message = msg;
    log.debug(logMessage);
};
module.exports = LogMessageModule;

