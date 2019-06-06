var express = require('express'),
    app = express(),
    LoginModel = require('../models/mysqlModels/loginModel'),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    lm,
    modelParams = require('../utils/params/mongoParameters');
app.set('super_secret', config.super_secret);

function EmailActivationController() {
    lm = new LoginModel();
}

EmailActivationController.prototype.emailActivation = function (req, res) {
    var referenceParams, token, tokenUrl, mailData;
    referenceParams = {
        email_address: req.body.email_address,
        app_type: req.body.app_type,
        message_type: req.body.message_type,
        redirect_url: req.body.redirect_url,
        params: modelParams({query: {email: req.body.email_address}})
    };
    lm.emailActivationReferenceCode(referenceParams, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            token = jwt.sign({
                verification_code: data.verification_code,
                email_address: data.to
            }, app.get('super_secret'), {expiresIn: 60 * 10});
            tokenUrl = referenceParams.redirect_url + "?token=" + token;
            mailData = {
                to: data.to,
                message_type: data.message_type,
                subject: data.subject,
                message: tokenUrl,
                name: data.verification_code
            };
            lm.maildata(mailData, function (err, data) {
                if (err) {
                    res.send(err);
                }
                if (data) {
                    res.status(200).send(JSON.stringify({data: data, status: 200}));
                }
            });
        }
    });
};
module.exports = EmailActivationController;