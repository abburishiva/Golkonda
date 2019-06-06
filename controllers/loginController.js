var app = require('express')(),
    _ = require('lodash'),
    LoginModel = require('../models/mysqlModels/loginModel'),
    jwt = require('jsonwebtoken'),
    config = require('../config/config.json'),
    secret = require('../config/default.json'),
    crypto = require('crypto'),
    modelParams = require('../utils/params/mongoParameters'),
    request = require("request"),
    lm;
app.set('super_secret', secret.super_secret);

function LoginController() {
    lm = new LoginModel();
}

LoginController.prototype.authenticate = function (req, res, next) {
    var self = this;
    if (req.body.type === 'accountActivation')
        return self.accountActivation(req, res, next);
    if (req.body.type === 'emailAddressExists')
        return self.emailAddressExists(req, res, next);
    return self.login(req, res, next);
};
LoginController.prototype.accountActivation = function (req, res) {
    var accountActivationParams = {
        email_address: req.body.email_address,
        app_type: req.body.app_type,
        verification_code: req.body.verification_code,
        params: modelParams({query: {email: req.body.email_address.toLowerCase()}})
    };
    lm.accountActivation(accountActivationParams, function (err, data) {
        if (err) {
            res.send(err);
        }
        if (data) {
            res.status(200).send(JSON.stringify({data: data, status: 200}));
        }
    });
};
LoginController.prototype.emailAddressExists = function (req, res) {
    lm.emailAddressExists(req.body, function (err, data) {
        if (err) {
            res.send(err);
        }
        if (data) {
            res.status(200).send(JSON.stringify({data: data, status: 200}));
        }
    });
};
LoginController.prototype.login = function (req, res) {
    var secret, userToken, params, ipAddress, token;
    if (req.body.redirectUri) {
        if (req.body.redirectUri.toLowerCase().indexOf("talentscreen") >= 0) {
            secret = config.dev.talentScreenSecret[req.body.logintype];
        }
        params = {
            "socialParams": {
                code: req.body.code,
                client_id: req.body.clientId,
                client_secret: secret,
                redirect_uri: req.body.redirectUri,
                grant_type: 'authorization_code'
            },
            logintype: req.body.logintype,
            ipAddress: req.connection.remoteAddress,
            appType: req.body.redirectUri,
            userAgent: req.headers['user-agent'],
            role: req.body.role
        };
    } else if (req.body.app_type && req.body.app_type.toLowerCase() === 'mobileapp') {
        params = {
            logintype: req.body.type,
            app_type: req.body.app_type,
            user_data: req.body.userData,
            ipAddress: req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };
    } else if (req.params.type && req.params.type.toLowerCase() === 'mobile') {
        params = {
            tokenId: req.body._id,
            isFirstLoginCompleted: true
        };
    } else {
        params = {
            logintype: req.body.type,
            username: req.body.email_address,
            password: crypto.createHash('md5').update(req.body.password).digest("hex"),
            apptype: req.body.app_type,
            ipAddress: req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        };
    }
    lm.login(params, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            token = jwt.sign(_.omit(data, ["source_details"]), app.get('super_secret'), {
                expiresIn: 60 * 60 * 12
            });
            ipAddress = req.connection.remoteAddress;
            userToken = {
                userDetails: {
                    id: data._id,
                    email: data.user_profile.email || data.source_details.username,
                    source: data.source_details.source,
                    role: data.role
                },
                token: token
            };
            var options = {
                method: 'POST',
                url: config.dev.ops_Url + '/v1/token/sharing',
                headers: {
                    'content-type': 'application/json',
                    'x-access-key': config.accessKey
                },
                body: userToken,
                json: true
            };
            if(data && (data.user_profile.email || data.source_details.username)){
                request(options, function (err, response, body) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        if (body && (body.id || body.n === 1 || body._id)) {
                            res.status(200).send(JSON.stringify({
                                message: "Authentication Successful",
                                status: 200,
                                userData: _.omit(data, ["source_details"]),
                                token: token
                            }));
                        } else {
                            res.status(403).send(JSON.stringify({"message": "Unauthorized"}));
                        }
                    }
                });
            }else{
                res.status(200).send(JSON.stringify({
                    message: "Authentication Successful",
                    status: 200,
                    userData: _.omit(data, ["source_details"]),
                    token: token
                }));
            }

        }
    });
};
module.exports = LoginController;
