var express = require('express'),
    app = express(),
    LoginModel = require('../models/mysqlModels/loginModel'),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    lm;
app.set('super_secret', config.super_secret);

function RegisterController() {
    lm = new LoginModel();
}

RegisterController.prototype.register = function (req, res) {
    var token, tokenUrl, mailData;
    lm.register(req.body, function (err, data) {
        if (err) {
            res.send(err);
        }
        if (data) {
            if (data.app_type.toLowerCase() === 'talentworks') {
                token = jwt.sign({email: req.body.email_address}, app.get('super_secret'), {expiresIn: 60 * 10});
                tokenUrl = req.body.url + "?token=" + token;
                mailData = {
                    to: req.body.username,
                    message_type: req.body.message_type,
                    message: "Your LoginUrl  is  <a href='" + tokenUrl + "'>Please click here </a><br><br>",
                    url: req.body.url
                };
                lm.maildata(mailData, function (err) {
                    if (err) {
                        res.status(err.code).send(JSON.stringify(err));
                    } else {
                        res.status(200).send(JSON.stringify({message: "You are successfully redirected to our site"}));
                    }
                });
            } else {
                token = jwt.sign({
                    verification_code: data.verification_code,
                    email_address: data.to
                }, app.get('super_secret'), {expiresIn: 60 * 60 * 1000});
                tokenUrl = data.redirect_url + "?token=" + token;
                mailData = {
                    to: data.to,
                    message_type: data.message_type,
                    message: tokenUrl,
                    name: data.verification_code
                };
                lm.maildata(mailData, function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.status(200).send(JSON.stringify({data: data, status: 200}));
                    }
                });
            }
        }
    });
};
module.exports = RegisterController;