var CandidateModel = require('../models/mongoModels/candidateModel'),
    modelParams = require('../utils/params/mongoParameters'),
    cm;
function AuthoriseController() {
    cm = new CandidateModel();
}

AuthoriseController.prototype.authorized = function (req, res, next) {
    var params = modelParams({email: req.body.userName, source: req.body.appType.toLowerCase().trim()});
    if (req.params.name.toLowerCase() === 'forgotpassword') {
        cm.forgetPassword(params, req.body, function (err, data) {
            if (err) {
                next(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else if (req.params.name.toLowerCase() === 'accountactivation') {
        cm.emailActivation(params, req.body, function (err, data) {
            if (err) {
                next(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else if (req.params.name.toLowerCase() === 'updateprofile') {
        cm.updateProfile(params, req.body, function (err, data) {
            if (err) {
                next(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else if (req.params.name.toLowerCase() === 'passwordchange') {
        cm.changePassword(params, req.body, function (err, data) {
            if (err) {
                next(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else if (req.params.name.toLowerCase() === 'referencecode') {
        cm.referenceCode(params, req.body, function (err, data) {
            if (err) {
                next(err);
            } else {
                res.status(200).send(data);
            }
        });
    } else {
        next({status: 400, error: 'Bad request'});
    }
};

module.exports = AuthoriseController;