var request = require('request'),
    qs = require('querystring'),
    crypto = require('crypto'),
    randomString = require("randomstring"),
    CandidateModel = require('../mongoModels/candidateModel'),
    EmployeeModel = require('../mongoModels/employeeModel'),
    TalentUsers = require('../mongoModels/talentUsersModel.js'),
    utils = require('../../utils/params/mongoParameters'),
    EmailEngineModel = require('../mysqlModels/emailEngineModel'),
    cm,
    em,
    tu,
    empModel;

function LoginModel() {
    em = new EmailEngineModel();
    cm = new CandidateModel();
    empModel = new EmployeeModel();
    tu = new TalentUsers();
}
LoginModel.prototype.emailAddressExists = function (params, callback) {
    var code, mailData, self = this, source_email = utils({query: {sourceEmail: params.email_address.toLowerCase()}});
    tu.find(source_email, function (err, results) {
        if (err) {
            callback({message: "Error while retrieving your email address."});
        }
        if (results.length > 0) {
            if (results[0].employerId) {
                callback({message: "The email address that you have entered already registered as employer. Please try using another email address"});
            } else {
                callback({message: "The email address that you have entered already registered as " + results[0].source + "login. Please try using another email address."});
            }
        } else {
            code = randomString.generate({
                length: 8,
                charset: 'alphanumeric'
            });
            mailData = {
                to: params.email_address.toLowerCase(),
                message_type: params.message_type,
                verification_code: code,
                name: params.name
            };
            self.maildata(mailData, function () {
            });
            tu.update(params.candidateId, {sourceEmail: params.email_address.toLowerCase()}, function () {
                cm.update(params.candidateId, {'auth_details.last_verification_code' : code}, function(){
                    callback(null, {code: code, email_address: params.email_address.toLowerCase()});
                });
            });
        }
    });
};

LoginModel.prototype.changePassword = function (passwordParams, callback) {
    var email;
    if (passwordParams.app_type.toLowerCase().trim() === 'talentscreen') {
        email = utils({query: {email: passwordParams.email_address, limit:10}});
        empModel.find(email, function (err, employerData) {
            if (err) {
                callback({message: "Error while retrieving your email address."});
            } else if (employerData.length > 0) {
                employerData[0] = employerData[0].toObject();
                employerData[0].role = 'employee';
                employerData[0].source_details.password = passwordParams.password;
                empModel.update(employerData[0]._id, employerData[0], callback);
            } else {
                cm.find(email, function (err, candidateData) {
                    if (err) {
                        callback({message: "Error while retrieving your email address."});
                    } else {
                        candidateData[0] = candidateData[0].toObject();
                        candidateData[0].role = 'candidate';
                        candidateData[0].source_details.password = passwordParams.password;
                        cm.update(candidateData[0]._id, candidateData[0], callback);
                    }
                });
            }
        });
    } else {
        callback({message: "bad request."});
    }
};

LoginModel.prototype.maildata = function (mailData, callback) {
    em.sendMessage(mailData, callback);
};
LoginModel.prototype.register = function (signUpParams, callback) {
    var params = utils({
        query: {
            email: signUpParams.email_address.toLowerCase()
        },
        limit: 10
    }), user = {}, code, source_email, mailData, talentUserData = {};
    if (signUpParams.app_type.toLowerCase().trim() === 'talentscreen') {
        source_email = utils({query: {sourceEmail: signUpParams.email_address.toLowerCase()}});
        tu.find(source_email, function (err, results) {
            if (err) {
                callback(err);
            }
            if (results.length > 0) {
                if (results[0].employerId) {
                    callback({
                        message: "The email address that you have entered already registered as employer. Please try using another email address"
                    });
                } else {
                    callback({message: "The email address that you have entered already registered as " + results[0].source + "login. Please try using another email address."});
                }
            } else {
                if (signUpParams.role === 'candidate') {
                    user.user_profile = {};
                    user.source_details = {};
                    user.auth_details = {};
                    user.user_profile.email = signUpParams.email_address.toLowerCase();
                    user.source_details.username = signUpParams.email_address.toLowerCase();
                    user.source_details.password = crypto.createHash('md5').update(signUpParams.password).digest("hex");
                    user.source_details.source = signUpParams.app_type.toLowerCase().trim();
                    cm.find(params, function (err, candidateData) {
                        if (err) {
                            callback({message: err});
                        } else if (candidateData.length > 0) {
                            callback({
                                message: "The email address that you have entered already registered as " + candidateData[0].source_details.source + "login. Please try using another email address."
                            });
                        } else {
                            code = randomString.generate({
                                length: 8,
                                charset: 'alphanumeric'
                            });
                            user.auth_details.last_verification_code = code;
                            cm.create(user, function (err, userData) {
                                if (err) {
                                    callback({
                                        message: "Error while creating your account. Please try again."
                                    });
                                } else {
                                    mailData = {
                                        to: signUpParams.email_address.toLowerCase(),
                                        message_type: signUpParams.message_type,
                                        verification_code: code,
                                        name: userData.user_profile.name,
                                        app_type: signUpParams.app_type,
                                        redirect_url: signUpParams.redirect_url
                                    };
                                    callback(null, mailData);
                                }
                                talentUserData.sourceEmail = signUpParams.email_address.toLowerCase();
                                talentUserData.candidateId = userData._id;
                                talentUserData.source = signUpParams.app_type.toLowerCase();
                                tu.create(talentUserData, function () {
                                    return undefined;
                                });
                            });
                        }
                    });
                } else if (signUpParams.role === 'employee') {
                    user.user_profile = {};
                    user.source_details = {};
                    user.auth_details = {};
                    user.user_profile.email = signUpParams.email_address.toLowerCase();
                    user.source_details.username = signUpParams.email_address.toLowerCase();
                    user.source_details.password = crypto.createHash('md5').update(signUpParams.password).digest("hex");
                    user.source_details.source = signUpParams.app_type.toLowerCase().trim();
                    empModel.find(params, function (err, employerData) {
                        if (err) {
                            callback({message: err});
                        } else if (employerData.length > 0) {
                            callback({
                                message: "The email address that you have entered already registered as employer. Please try using another email address"
                            });
                        } else {
                            code = randomString.generate({length: 8, charset: 'alphanumeric'});
                            user.auth_details.last_verification_code = code;
                            empModel.create(user, function (err, userData) {
                                if (err) {
                                    callback({
                                        message: "Error while creating your account. Please try again."
                                    });
                                } else {
                                    mailData = {
                                        to: signUpParams.email_address.toLowerCase(),
                                        message_type: signUpParams.message_type,
                                        subject: signUpParams.subject,
                                        verification_code: code,
                                        app_type: signUpParams.app_type,
                                        name: userData.user_profile.name,
                                        redirect_url: signUpParams.redirect_url
                                    };
                                    callback(null, mailData);
                                    talentUserData.sourceEmail = signUpParams.email_address.toLowerCase();
                                    talentUserData.employerId = userData._id;
                                    talentUserData.source = signUpParams.app_type.toLowerCase();
                                    tu.create(talentUserData, function () {
                                        return undefined;
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};
LoginModel.prototype.accountActivation = function (accountActivationParams, callback) {
    var email = utils({query: {email: accountActivationParams.email_address, limit:10}});
    empModel.find(email, function (err, employeeData) {
        if (err) {
            callback({message: "Error while retrieving your email address."});
        } else if (employeeData.length > 0) {
            if (employeeData[0].auth_details.last_verification_code === accountActivationParams.verification_code) {
                employeeData[0].auth_details.is_user_verified = 'Y';
                empModel.update(employeeData[0]._id, employeeData[0], callback);
            } else {
                callback({message: 'You have entered a wrong verification code'});
            }

        } else {
            cm.find(email, function (err, candidateData) {
                if (err) {
                    callback({message: err});
                } else if (candidateData.length <= 0) {
                    callback({
                        message: "This email address doesn't exists. Please try with a valid email address."
                    });
                } else {
                    if (candidateData[0].auth_details.last_verification_code === accountActivationParams.verification_code) {
                        candidateData[0].auth_details.is_user_verified = 'Y';
                        cm.update(candidateData[0]._id, candidateData[0], callback);
                    } else {
                        callback({message: 'You have entered a wrong verification code'});
                    }
                }
            });
        }
    });
};
LoginModel.prototype.codeVerification = function (codeVerifyParams, callback) {
    var email = utils({query: {email: codeVerifyParams.email_address.toLowerCase(), limit:10}});
    empModel.find(email, function (err, employerData) {
        if (err) {
            callback({message: err});
        } else if (employerData.length > 0) {
            if (codeVerifyParams.length <= 0) {
                callback({
                    message: "This email address doesn't exists. Please try with a valid email address"
                });
            } else {
                callback(null, employerData);
            }

        } else {
            cm.find(email, function (err, candidateData) {
                if (err) {
                    callback({message: err});
                } else if (codeVerifyParams.length <= 0) {
                    callback({
                        message: "This email address doesn't exists. Please try with a valid email address"
                    });
                } else {
                    callback(null, candidateData);
                }
            });
        }
    });
};
LoginModel.prototype.login = function (params, callback) {
    var self = this, accessTokenUrl, graphApiUrl, userApiUrl, peopleApiUrl, fields, linkedInParams, accessToken, headers, email, response;
    if (params.isFirstLoginCompleted && params.tokenId) {
        cm.findOne({}, params.tokenId, function (err, results) {
            if (results) {
                results = results.toObject();
                results.role = 'candidate';
                callback(err, results);
            } else {
                empModel.findOne({}, params.tokenId, function (err, results) {
                    results = results.toObject();
                    results.role = 'employee';
                    callback(err, results);
                });
            }
        });
    } else if (params.logintype === 'google') {
        if (params.app_type && params.app_type.toLowerCase() === 'mobileapp') {
            email = params.user_data.email;
            response = params.user_data;
            self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, 'talentscreen', '', callback);
        } else {
            accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
            peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
            headers = {Authorization: 'Bearer ' + accessToken};
            request.post(accessTokenUrl, {json: true, form: params.socialParams}, function (err, response, token) {
                if (err) {
                    return callback(err);
                }
                accessToken = token.access_token;
                headers = {Authorization: 'Bearer ' + accessToken};
                request.get({url: peopleApiUrl, headers: headers, json: true}, function (err, response) {
                    if (err) {
                        return callback(err);
                    }
                    response.app_type = 'web-app';
                    email = response.body.email;
                    self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, params.appType, params.role, callback);
                });
            });
        }
    } else if (params.logintype === 'facebook') {
        if (params.app_type && params.app_type.toLowerCase() === 'mobileapp') {
            email = params.user_data.email;
            response = params.user_data;
            self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, 'talentscreen', '', callback);
        } else {
            fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name', 'picture', 'location', 'birthday'];
            accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
            graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
            request.get({
                url: accessTokenUrl,
                qs: params.socialParams,
                json: true
            }, function (err, response, accessToken) {
                if (err) {
                    return callback(err);
                }
                if (response.statusCode !== 200) {
                    return response.status(500).send({message: accessToken.error.message});
                }
                request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response) {
                    if (err) {
                        callback(err);
                    } else {
                        response.app_type = 'web-app';
                        email = response.body.email;
                        self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, params.appType, params.role, callback);
                    }
                });
            });
        }
    } else if (params.logintype === 'github') {
        if (params.app_type && params.app_type.toLowerCase() === 'mobileapp') {
            email = params.user_data.login;
            response = params;
            self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, 'talentscreen', '', callback);
        } else {
            accessTokenUrl = 'https://github.com/login/oauth/access_token';
            userApiUrl = 'https://api.github.com/user?';
            request.get({url: accessTokenUrl, qs: params.socialParams}, function (err, response, accessToken) {
                if (err) {
                    return callback(err);
                }
                accessToken = qs.parse(accessToken);
                headers = {'User-Agent': 'Satellizer'};
                request.get({url: userApiUrl, qs: accessToken, headers: headers, json: true}, function (err, response) {
                    if (err) {
                        return callback(err);
                    }
                    response.app_type = 'web-app';
                    email = response.body.id;
                    self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, params.appType, params.role, callback);
                });
            });
        }
    } else if (params.logintype === 'linkedin') {
        if (params.app_type && params.app_type.toLowerCase() === 'mobileapp') {
            peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
            linkedInParams = {
                oauth2_access_token: params.user_data.access_token,
                format: 'json'
            };
            request.get({url: peopleApiUrl, qs: linkedInParams, json: true}, function (err, response) {
                if (err) {
                    return callback(err);
                }
                email = response.body.emailAddress;
                response.app_type = 'mobileapp';
                self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, 'talentscreen', '', callback);
            });
        } else {
            accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
            peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
            request.post(accessTokenUrl, {form: params.socialParams, json: true}, function (err, response, body) {
                if (err) {
                    return callback(err);
                }
                if (response.statusCode !== 200) {
                    return response.status(response.statusCode).send({message: body.error_description});
                }
                linkedInParams = {
                    oauth2_access_token: body.access_token,
                    format: 'json'
                };
                request.get({url: peopleApiUrl, qs: linkedInParams, json: true}, function (err, response) {
                    if (err) {
                        return callback(err);
                    }
                    response.app_type = 'web-app';
                    email = response.body.emailAddress;
                    self.socialLogin(params.logintype, response, email, params.userAgent, params.ipAddress, params.appType, params.role, callback);
                });
            });
        }
    } else {
        self.customLogin(params, callback);
    }
};
LoginModel.prototype.customLogin = function (loginParams, callback) {
    var params;
    if (loginParams.apptype.toLowerCase().trim() === 'talentscreen') {
        params = utils({query: {email: loginParams.username.toLowerCase(), limit:10}});
        empModel.find(params, function (err, results) {
            if (err) {
                callback(err);
            } else if (results.length > 0) {
                if (results[0].auth_details.is_user_verified === 'Y') {
                    if (results[0].source_details.password === loginParams.password) {
                        results[0] = results[0].toObject();
                        results[0].role = 'employee';
                        callback(null, results[0]);
                    } else {
                        callback({message: "Wrong password. Try again."});
                    }
                } else {
                    callback({message: "Please check your email to activate your account."});
                }
            } else {
                cm.find(params, function (err, results) {
                    if (err) {
                        callback(err);
                    } else if (results.length > 0) {
                        if (results[0].auth_details.is_user_verified === 'Y') {
                            if (results[0].source_details.password === loginParams.password) {
                                results[0] = results[0].toObject();
                                results[0].role = 'candidate';
                                callback(null, results[0]);
                            } else {
                                if(results[0].source_details.source === 'talentscreen'){
                                    callback({message: "Wrong password. Try again."});
                                }else if (results[0].source_details.source === 'github' || 'facebook' || 'linkedin' || 'google'){
                                    callback({message: "The email address that you have entered already registered as " + results[0].source_details.source + " login. Please try using another email address."});
                                }
                            }
                        } else {
                            callback({
                                message: "Please check your email to activate your account."
                            });
                        }
                    } else {
                        callback({message: "You have not registered. Please sign up."});
                    }
                });
            }
        });

    }
};
LoginModel.prototype.referenceCode = function (referenceParams, callback) {
    var email = utils({query: {email: referenceParams.email_address, limit:10 }}), mailData;
    cm.find(email, function (err, candidateData) {
        if (err) {
            callback({message: "Error while retrieving your data."});
        } else if (candidateData.length > 0) {
            if (candidateData[0].source_details.source !== 'talentscreen') {
                callback({message: "You are not registered as custom login to change your password."});
            } else {
                mailData = {
                    to: candidateData[0].user_profile.email,
                    message_type: referenceParams.message_type,
                    subject: referenceParams.subject,
                    name: candidateData[0].user_profile.name
                };
                cm.update(candidateData[0]._id, candidateData[0], function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, mailData);
                    }
                });
            }
        } else {
            empModel.find(email, function (err, employeeData) {
                if (err) {
                    callback({message: "Error while retrieving your data."});
                } else if (employeeData.length <= 0) {
                    callback({message: "This email address doesn't exists. Please try with a valid email address."});
                } else {
                    mailData = {
                        to: employeeData[0].user_profile.email,
                        message_type: referenceParams.message_type,
                        subject: referenceParams.subject,
                        name: employeeData[0].user_profile.name
                    };
                    empModel.update(employeeData[0]._id, employeeData[0], function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, mailData);
                        }
                    });
                }
            });
        }
    });
};
LoginModel.prototype.emailActivationReferenceCode = function (referenceParams, callback) {
    var email = utils({query: {email: referenceParams.email_address, limit:10}}), mailData, code;
    cm.find(email, function (err, candidateData) {
        if (err) {
            callback({message: "Error while retrieving your data."});
        } else if (candidateData.length > 0) {
            if (candidateData[0].auth_details.is_user_verified === 'N') {
                code = randomString.generate({
                    length: 8,
                    charset: 'alphanumeric'
                });
                candidateData[0].auth_details.last_verification_code = code;
                mailData = {
                    to: candidateData[0].user_profile.email,
                    message_type: referenceParams.message_type,
                    subject: referenceParams.subject,
                    verification_code: code,
                    name: candidateData[0].user_profile.name
                };
                cm.update(candidateData[0]._id, candidateData[0], function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, mailData);
                    }
                });
            } else {
                callback({message: 'Your email address is already activated.'});
            }
        } else {
            empModel.find(email, function (err, employerData) {
                if (err) {
                    callback({message: "Error while retrieving your data."});
                } else if (employerData.length <= 0) {
                    callback({
                        message: "This email address doesn't exists. Please try with a valid email address."
                    });
                } else if (employerData[0].auth_details.is_user_verified === 'N') {
                    code = randomString.generate({
                        length: 8,
                        charset: 'alphanumeric'
                    });
                    employerData[0].auth_details.last_verification_code = code;
                    mailData = {
                        to: employerData[0].user_profile.email,
                        message_type: referenceParams.message_type,
                        subject: referenceParams.subject,
                        verification_code: code,
                        name: employerData[0].user_profile.name
                    };
                    empModel.update(employerData[0]._id, employerData[0], function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, mailData);
                        }
                    });
                } else {
                    callback({message: 'Your email address is already activated. Please try login.'});
                }
            });
        }
    });
};

//social login
LoginModel.prototype.socialLogin = function (logintype, response, email_address, userAgent, ipAddress, appType, requestedRoleName, callback) {
    var user, source_email, email, talentUserData = {};
    if (appType.toLowerCase().indexOf("talentscreen") >= 0) {
        user = {
            source_details: {},
            user_profile: {},
            auth_details: {}
        };
        if (logintype === 'google') {
            if (response) {
                if (response.app_type.toLowerCase() === 'mobileapp') {
                    user.source_details.username = response.name;
                    user.user_profile.email = email_address;
                    user.user_profile.name = response.name;
                    user.source_details.source = 'google';
                    user.user_profile.picture_link = response.photo;
                    user.source_details.source_id = response.id;
                } else if (response.app_type.toLowerCase() === 'web-app') {
                    user.user_profile.email = response.body.email;
                    user.user_profile.name = response.body.name;
                    user.source_details.username = response.body.email;
                    user.source_details.source = 'google';
                    user.auth_details.is_user_verified = 'Y';
                    user.user_profile.picture_link = response.body.picture;
                    user.source_details.source_id = response.body.sub;
                    user.source_details.source_email = response.body.email;
                }
            }
        } else if (logintype === 'facebook') {
            if (response.app_type.toLowerCase() === 'mobileapp') {
                var data = JSON.parse(response.profile);
                email_address = data.email;
                user.user_profile.email = data.email;
                user.user_profile.name = data.name;
                user.source_details.source = 'facebook';
                user.user_profile.picture_link = data.picture.data.url;
                user.source_details.source_id = data.id;
                user.source_details.username = data.email;
            } else if (response.app_type.toLowerCase() === 'web-app') {
                user.user_profile.email = response.body.email;
                user.source_details.username = response.body.email;
                user.source_details.source = 'facebook';
                user.source_details.source_id = response.body.id;
                user.user_profile.name = response.body.name;
                user.user_profile.picture_link = response.body.picture.data.url;
            }
        } else if (logintype === 'github') {
            if (response.app_type.toLowerCase() === 'mobileapp') {
                user.user_profile.email = email_address;
                user.user_profile.name = response.user_data.login;
                user.source_details.source = 'github';
                user.user_profile.picture_link = response.user_data.url;
                user.source_details.source_id = response.user_data.id;
                user.source_details.username = email_address;
            } else {
                user.source_details.username = response.body.email;
                user.user_profile.email = response.body.email;
                user.source_details.source = 'github';
                user.source_details.source_id = response.body.id;
                user.user_profile.name = response.body.login;
                user.user_profile.picture_link = response.body.avatar_url;
            }
        } else if (logintype === 'linkedin') {
            user.source_details.username = response.body.emailAddress;
            user.source_details.source = 'linkedin';
            user.user_profile.email = response.body.emailAddress;
            user.user_profile.name = response.body.firstName + " " + response.body.lastName;
            user.auth_details.is_user_verified = 'Y';
            user.user_profile.picture_link = response.body.pictureUrl;
        }
        if (response) {
            if (response.app_type.toLowerCase() === 'web-app') {
                if (user.user_profile.email) {
                    email = utils({query: {email: user.user_profile.email, limit: 10}});
                } else if (response.body.id) {
                    email = utils({query: {source_id: response.body.id, limit:10}});
                } else {
                    callback({message: 'Oops,Something Went Wrong.Please Try Again'});
                }
            } else if (response.app_type.toLowerCase() === 'mobileapp') {
                if (email_address) {
                    email = utils({query: {email: email_address, limit:10}});
                } else if (user.source_details.source_id) {
                    email = utils({query: {source_id: user.source_details.source_id, limit:10}});
                } else {
                    callback({message: 'Oops,Something Went Wrong.Please Try Again'});
                }
            }
            if (user.user_profile.email) {
                source_email = utils({query: {sourceEmail: user.user_profile.email.toLowerCase()}});
                tu.find(source_email, function (err, results) {
                    if (err) {
                        return callback(err);
                    }
                    cm.find(email, function (err, data) {
                        if (results.length > 0 && results[0].employerId) {
                            callback({message: "The email address that you have entered already registered as employer login. Please try using another email address."});
                        } else if ((data.length && results.length) > 0) {
                            if ((results[0].source && data[0].source_details.source) !== logintype) {
                                callback({message: "The email address that you have entered already registered as " + results[0].source + " login. Please try using another email address."});
                            } else {
                                data[0] = data[0].toObject();
                                data[0].role = 'candidate';
                                callback(err, data[0]);
                            }
                        } else if ((data.length && results.length) <= 0) {
                            cm.create(user, function (err, userData) {
                                talentUserData.candidateId = userData._id;
                                talentUserData.sourceEmail = userData.user_profile.email.toLowerCase();
                                talentUserData.source = userData.source_details.source.toLowerCase();
                                talentUserData.profileLink = user.user_profile.picture_link;
                                tu.create(talentUserData, function () {
                                    return undefined;
                                });
                                userData = userData.toObject();
                                userData.role = 'candidate';
                                callback(err, userData);
                            });
                        }
                    });
                });
            } else {
                cm.find(email, function (err, data) {
                    if (data.length <= 0) {
                        cm.create(user, function (err, userData) {
                            talentUserData.candidateId = userData._id;
                            talentUserData.source = userData.source_details.source.toLowerCase();
                            talentUserData.profileLink = user.user_profile.picture_link;
                            tu.create(talentUserData, function () {
                                return undefined;
                            });
                            userData = userData.toObject();
                            userData.role = 'candidate';
                            callback(err, userData);
                        });
                    } else {
                        data[0] = data[0].toObject();
                        data[0].role = 'candidate';
                        callback(err, data[0]);
                    }
                });
            }
        }
    }
};
module.exports = LoginModel;
