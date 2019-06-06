var express = require('express'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/default.json'),
    process = require('../../config/config.json'),
    Logger = require('../winston/logModule'),
    app = express(),
    router = express.Router,
    log = new Logger();
app.set('super_secret', config.super_secret);
var middlewareAuth = function (req, res, next) {
    if (req.query.authentication !== 'false' || process.env.NODE_ENV === 'production') {
        var token = req.headers['x-access-token'];
        if (token) {
            log.info('info at verify the requested token in middleAuth.js');
            jwt.verify(token, app.get('super_secret'), function (err, decoded) {
                if (err) {
                    log.info('info at err handling condition in middleAuth file of utils');
                    log.error(req, err);
                    return res.status(401).json({success: false, status: 401, message: 'Authentication Is Failed.'});
                } else {
                    log.info('successfully decoded the token data');
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            log.info('info at middleAuth.js and "No token provided"');
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    } else {
        log.info('info at authentication is false condition in middleAuth.js');
        next();
    }
};
module.exports = middlewareAuth;
