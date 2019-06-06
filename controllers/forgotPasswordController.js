var express = require('express'),
    app = express(),
    LoginModel = require('../models/mysqlModels/loginModel'),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    crypto = require('crypto'),
    modelParams = require('../utils/params/mongoParameters'),
    lm;
app.set('super_secret', config.super_secret);

function ForgotPasswordController() {
    lm = new LoginModel();
}
ForgotPasswordController.prototype.resetPassword = function (req, res) {
    var referenceParams, token, tokenUrl, mailData, passwordParams;
    if (req.body.type === 'referenceCode') {
        referenceParams = {
            email_address: req.body.email_address.toLowerCase(),
            app_type: req.body.app_type,
            message_type: req.body.message_type,
            redirect_url: req.body.redirect_url,
            ipAddress: req.connection.remoteAddress,
            params: modelParams({query: {email: req.body.email_address.toLowerCase()}})
        };
        lm.referenceCode(referenceParams, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                token = jwt.sign({email_address: data.to}, app.get('super_secret'), {expiresIn: 60 * 10});
                tokenUrl = referenceParams.redirect_url + "?token=" + token;
                mailData = {
                    to: data.to,
                    message_type: data.message_type,
                    subject: data.subject,
                    message: tokenUrl,
                    name: data.name
                };
                lm.maildata(mailData, function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).send(JSON.stringify({data: data, status: 200, tokenUrl: tokenUrl}));
                    }
                });
            }
        });
    } else if (req.body.type === 'changePassword') {
        passwordParams = {
            email_address: req.body.email_address,
            app_type: req.body.app_type.toLowerCase().trim(),
            password: crypto.createHash('md5').update(req.body.password).digest("hex"),
            params: modelParams({query: {email: req.body.email_address}})
        };
        lm.changePassword(passwordParams, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send(JSON.stringify({data: data, status: 200}));
            }
        });
    }

};

module.exports = ForgotPasswordController;