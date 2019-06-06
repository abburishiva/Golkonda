var winston = require('winston');
var config = require('../../config/default.json');

var info = new winston.Logger({
    level: 'info',
    transports: [
        new (winston.transports.File)(config.logtransports)
    ],
    exitOnError: false
});
var error = new winston.Logger({
    level: 'error',
    transports: [
        new (winston.transports.File)(config.logtransports)
    ],
    exitOnError: false
});
var debug = new winston.Logger({
    level: 'debug',
    transports: [
        new (winston.transports.File)(config.logtransports)
    ],
    exitOnError: false
});

module.exports = {
    info: function (msg) {
        info.info(msg);
    },
    error: function (msg, req) {
        error.error(msg, req);
    },
    debug: function (msg) {
        debug.debug(msg);
    }
};
