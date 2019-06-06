var request = require('request'),
    config = require('../../config/config.json');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';


function unAuthorized(res) {
    res.status(403).json({
        error: {
            message: 'Not Authorized!'
        }
    });
}
module.exports.isSuper = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded) {
            if (req.decoded.role) {
                if (req.decoded.role.toLowerCase() === 'employee' && req.decoded.auth_details.is_super) {
                    next();
                    return;
                }
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isCurrentEmployer = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded && req.decoded.role) {
            if (req.decoded.role.toLowerCase() === 'employee') {
                if (req.baseUrl === '/v1/resumes' && !req.decoded.auth_details.is_super && req.decoded.role.toLowerCase() === 'employee') {
                    if (req.query.q) {
                        req.query.type = 'search';
                    } else {
                        req.query.type = 'employerView';
                    }
                } else if (req.baseUrl === '/v1/resumes' && req.decoded.auth_details.is_super && req.query.q) {
                    req.query.type = 'search';
                }
                next();
                return;
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isCurrentCandidate = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded) {
            if (req.decoded.role) {
                if (req.decoded.role.toLowerCase() === 'candidate' && req.decoded._id === req.params.candidate_id) {
                    next();
                    return;
                }
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isSuperOrCurrentEmployer = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded) {
            if (req.decoded.role) {
                if (req.decoded.role.toLowerCase() === 'employee') {
                    if (req.decoded.auth_details.is_super || req.decoded._id === req.params.emp_id) {
                        next();
                        return;
                    }
                }
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isSuperOrCurrentCandidate = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded) {
            if (req.decoded.role) {
                if (req.decoded.auth_details.is_super || (req.decoded.role.toLowerCase() === 'candidate' && req.decoded._id === req.params.candidate_id)) {
                    next();
                    return;
                }
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isCurrentEmployerOrCurrentCandidate = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded) {
            if (req.decoded.role) {
                if ((req.decoded.role.toLowerCase() === 'employee') || (req.decoded.role.toLowerCase() === 'candidate' && req.decoded._id === req.params.candidate_id)) {
                    next();
                    return;
                }
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isSuperOrCurrentEmployerOrCurrentCandidate = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.decoded) {
            if (req.decoded.role) {
                if ((req.decoded.role.toLowerCase() === 'employee' && req.decoded.auth_details.is_super) || (req.decoded.role.toLowerCase() === 'employee' && req.decoded._id === req.params.id) || ((req.decoded.role.toLowerCase() === 'candidate' && req.decoded._id === req.params.id))) {
                    if (req.decoded.role.toLowerCase() === 'employee' && !req.decoded.auth_details.is_super) {
                        req.params.emp_id = req.params.id;
                        delete req.params.id;
                    }
                    if (req.baseUrl === '/v1/candidates' && req.decoded.role.toLowerCase() === 'candidate') {
                        if (req.originalUrl.indexOf('shareInterviews') > 0 || req.url.indexOf('interviews') > 0) {
                            req.query.candidateEmail = req.decoded.user_profile.email;
                            req.params.candidate_id = req.params.id;
                            delete req.params.id;
                        }
                    }
                    next();
                    return;
                }
            }
        }
        unAuthorized(res);
    } else {
        next();
    }
};
module.exports.isAppAuthenticated = function (req, res, next) {
    if (req.query.authentication !== 'false') {
        if (req.headers['x-access-key']) {
            request.post({
                url: config.dev.base_url + '/v1/user/authenticate',
                form: config.superCredentials
            }, function (err, httpResponse, body) {
                if (err) {
                    return res.status({status: 500, message: err});
                } else {
                    var options = {
                        method: 'GET',
                        url: config.dev.ops_Url + '/v1/private/keys?key=' + req.headers['x-access-key'],
                        headers: {
                            'x-access-token': JSON.parse(body).token
                        }
                    };
                    request(options, function (err, response) {
                        if (err) {
                            res.status(500).send(err);
                        } else if (JSON.parse(response.body).status !== 404 && JSON.parse(response.body)[0].key === req.headers['x-access-key']) {
                            next();
                        } else {
                            return res.status(401).json({
                                success: false,
                                status: 401,
                                message: ' Key Authentication Is Failed.'
                            });
                        }
                    });
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No AccessKey Provided.'
            });
        }
    } else {
        next();
    }
};
