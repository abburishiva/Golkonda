var express = require('express'),
    app = express(),
    LoginModel = require('../models/mysqlModels/loginModel'),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    modelParams = require('../utils/params/mongoParameters'),
    lm;
app.set('super_secret', config.super_secret);

function CodeVerificationController() {
    lm = new LoginModel();
}

CodeVerificationController.prototype.codeVerification = function (req, res, next) {
    var token, codeVerifyParams, tokenDecode;
    if (req.body.token) {
        token = req.body.token;
        tokenDecode = jwt.decode(token, app.get('super_secret'));
        codeVerifyParams = {
            verification_code: tokenDecode.verification_code,
            email_address: tokenDecode.email_address.toLowerCase(),
            params: modelParams({
                email: tokenDecode.email_address.toLowerCase(),
                source: req.body.app_type.toLowerCase().trim()
            })
        };
    }
    lm.codeVerification(codeVerifyParams, function (err, data) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(JSON.stringify({data: data, status: 200}));
        }
    });
};
module.exports = CodeVerificationController;