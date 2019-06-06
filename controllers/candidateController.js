var app = require('express')(),
    _ = require('lodash'),
    CandidateModel = require('../models/mongoModels/candidateModel'),
    TalentUsersModel = require('../models/mongoModels/talentUsersModel'),
    CommonController = require('../utils/controllerUtil'),
    Utils = require('../utils/params/mongoParameters'),
    secret = require('../config/default.json'),
    config = require('../config/config.json'),
    Logger = require('../utils/winston/logModule'),
    Cache = require('../utils/cache/cacheUtil'),
    request = require("request"),
    jwt = require('jsonwebtoken'),
    log,
    cache,
    cm,
    tu,
    utils,
    controllerUtil;
app.set('super_secret', secret.super_secret);

function CandidateController() {
    cm = new CandidateModel();
    controllerUtil = new CommonController();
    tu = new TalentUsersModel();
    log = new Logger();
    cache = new Cache();
}

CandidateController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(cm, req, res, next);
    log.info("info at CandidateController getAll method and req goes to controllerUtil function");
};
CandidateController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cm, req, res, next);
    log.info("info at CandidateController getById method and req goes to controllerUtil function");
};
CandidateController.prototype.create = function (req, res, next) {
    controllerUtil.create(cm, req, res, next);
    log.info("info at CandidateController create method and req goes to controllerUtil function");
};
CandidateController.prototype.update = function (req, res, next) {
    var decode = jwt.decode(req.headers['x-access-token']), token;
    if (decode && (!decode.user_profile.email || decode.user_profile.email === null)) {
        var params = Utils({query: {sourceEmail: req.body.user_profile.email}});
        tu.find(params, function (err, exist) {
            if (err) {
                log.error(req, err);
                return next({status: 500, error: err});
            } else if (exist.length <= 0) {
                cm.update(req.params.candidate_id, req.body, function (err, result) {
                    log.info("updating the data:-" + result);
                    if (err) {
                        log.error(req, err);
                        return next({status: 500, error: err});
                    } else if (result === null) {
                        log.info("No Content Is Updated");
                        res.status(404).json({status: 404, message: 'No Content Is Updated'});
                    } else {
                        tu.update(req.params.candidate_id, {sourceEmail: req.body.user_profile.email}, function (err, resData) {
                            if (err) {
                                log.error(err);
                                return next({status: 500, error: err});
                            } else if (resData && resData.nModified === 0) {
                                res.status(404).json({message: "No Content Is Updated...!"});
                            } else if (resData && resData.n === 1 && resData.nModified === 1) {
                                log.info("Data is deleted in cache...!!");
                                cache.delete(req.baseUrl, req.url);
                                cm.findOne({}, req.params.candidate_id, function (err, data) {
                                    if (err) {
                                        res.status(500).send(err);
                                    } else if (data && data.user_profile.email) {
                                        data._doc.role = "candidate";
                                        token = jwt.sign(_.omit(data._doc, ["source_details"]), app.get('super_secret'), {expiresIn: 60 * 60});
                                        var userToken = {
                                            userDetails: {
                                                id: data._id,
                                                email: data.user_profile.email || data.source_details.username,
                                                source: data.source_details.source,
                                                role: "candidate"
                                            },
                                            token: token
                                        },
                                            options = {
                                            method: 'POST',
                                            url: config.qa.ops_Url + '/v1/token/sharing',
                                            headers: {
                                                'content-type': 'application/json',
                                                'x-access-key': config.accessKey
                                            },
                                            body: userToken,
                                            json: true
                                        };
                                        request(options, function (err, response, body) {
                                            if (err) {
                                                res.status(500).send(err);
                                            } else {
                                                if (body && (body.id || body.n === 1 || body._id)) {
                                                    res.status(200).send(JSON.stringify({
                                                        message: "Authentication Successful",
                                                        status: 200,
                                                        userData: _.omit(data._doc, ["source_details"]),
                                                        token: token
                                                    }));
                                                } else {
                                                    res.status(403).send(JSON.stringify({"message": "Unauthorized"}));
                                                }
                                            }
                                        });
                                    } else {
                                        res.status(404).json({status: 404, message: 'No Content Is Updated'});
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                log.info("The email address already registered");
                res.status(200).json({mailExist: "The email address that you have entered already registered as " + exist[0].source + " login. Please try using another email address."});
            }
        });
    } else {
        controllerUtil.update(cm, req, res, next);
    }
    log.info("info at CandidateController update method and req goes to controllerUtil function");
};
CandidateController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cm, req, res, next);
    log.info("info at CandidateController remove method and req goes to controllerUtil function");
};

module.exports = CandidateController;
