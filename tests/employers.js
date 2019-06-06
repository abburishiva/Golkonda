/*global process,describe,it,execute,i*/
/*jslint nomen: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('./tokens'),
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    dynamicId,
    url = baseUrl + "employers",
    data = require('./data/employersData.json'),
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMPLOYERS", function () {
    var testSuite = this.title;
    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_EMPLOYERS_DETAILS_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response =  chakram.get(url, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    if (result.body.length > 0) {
                        expect(result.body[0]).to.have.property('_id');
                        expect(result.body[0].auth_details).to.have.property('registereddatetime');
                        expect(result.body[0].auth_details).to.have.property('last_verification_code');
                        expect(result.body[0].auth_details).to.have.property('first_login_completed');
                    }
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_GET_EMPLOYER_BY_ID_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response =  chakram.get(url + '/' + testCaseData.input.id, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.body._id).to.equal(testCaseData.input.id);
                    expect(result.body.user_profile.email).to.equal(testCaseData.expected.user_profile.email);
                    expect(result.body.user_profile.name).to.equal(testCaseData.expected.user_profile.name);
                    expect(result.body.source_details.username).to.equal(testCaseData.expected.source_details.username);
                    expect(result.body.source_details.password).to.equal(testCaseData.expected.source_details.password);
                    expect(result.body.source_details.source).to.equal(testCaseData.expected.source_details.source);
                    expect(result.body.auth_details.registereddatetime).to.equal(testCaseData.expected.auth_details.registereddatetime);
                    expect(result.body.auth_details.last_verification_code).to.equal(testCaseData.expected.auth_details.last_verification_code);
                    expect(result.body.auth_details.first_login_completed).to.equal(testCaseData.expected.auth_details.first_login_completed);
                    expect(result.body.auth_details.is_user_verified).to.equal(testCaseData.expected.auth_details.is_user_verified);
                    expect(result.body.employer_details.company_name).to.equal(testCaseData.expected.employer_details.company_name);
                    expect(result.body.employer_details.country_name).to.equal(testCaseData.expected.employer_details.country_name);
                    expect(result.body.employer_details.company_size).to.equal(testCaseData.expected.employer_details.company_size);
                    expect(result.body.employer_details.job_title).to.equal(testCaseData.expected.employer_details.job_title);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (result) {
                    if (result.body.user_profile.email === config.employee.email_address ) {
                        expect(result.body._id).to.equal(testCaseData.input.id);
                        expect(result.body.user_profile.email).to.equal(testCaseData.expected.user_profile.email);
                        expect(result.body.source_details.username).to.equal(testCaseData.expected.source_details.username);
                        expect(result.body.source_details.password).to.equal(testCaseData.expected.source_details.password);
                        expect(result.body.source_details.source).to.equal(testCaseData.expected.source_details.source);
                        expect(result.body.auth_details.registereddatetime).to.equal(testCaseData.expected.auth_details.registereddatetime);
                        expect(result.body.auth_details.last_verification_code).to.equal(testCaseData.expected.auth_details.last_verification_code);
                        expect(result.body.auth_details.first_login_completed).to.equal(testCaseData.expected.auth_details.first_login_completed);
                        expect(result.body.auth_details.is_user_verified).to.equal(testCaseData.expected.auth_details.is_user_verified);
                        expect(result.body.employer_details.company_name).to.equal(testCaseData.expected.employer_details.company_name);
                        expect(result.body.employer_details.country_name).to.equal(testCaseData.expected.employer_details.country_name);
                        expect(result.body.employer_details.company_size).to.equal(testCaseData.expected.employer_details.company_size);
                        expect(result.body.employer_details.job_title).to.equal(testCaseData.expected.employer_details.job_title);
                    }
                    else {
                        expect(result.response.statusCode).to.equal(403);
                    }
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_GET_EMPLOYER_BY_EMAIL_ID_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response =  chakram.get(url + '?email=' + testCaseData.input.emailid, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.body[0]._id).to.equal(testCaseData.expected._id);
                    expect(result.body[0].user_profile.email).to.equal(testCaseData.expected.user_profile.email);
                    expect(result.body[0].user_profile.name).to.equal(testCaseData.expected.user_profile.name);
                    expect(result.body[0].source_details.username).to.equal(testCaseData.expected.source_details.username);
                    expect(result.body[0].source_details.password).to.equal(testCaseData.expected.source_details.password);
                    expect(result.body[0].source_details.source).to.equal(testCaseData.expected.source_details.source);
                    expect(result.body[0].auth_details.registereddatetime).to.equal(testCaseData.expected.auth_details.registereddatetime);
                    expect(result.body[0].auth_details.last_verification_code).to.equal(testCaseData.expected.auth_details.last_verification_code);
                    expect(result.body[0].auth_details.first_login_completed).to.equal(testCaseData.expected.auth_details.first_login_completed);
                    expect(result.body[0].auth_details.is_user_verified).to.equal(testCaseData.expected.auth_details.is_user_verified);
                    expect(result.body[0].employer_details.company_name).to.equal(testCaseData.expected.employer_details.company_name);
                    expect(result.body[0].employer_details.country_name).to.equal(testCaseData.expected.employer_details.country_name);
                    expect(result.body[0].employer_details.company_size).to.equal(testCaseData.expected.employer_details.company_size);
                    expect(result.body[0].employer_details.job_title).to.equal(testCaseData.expected.employer_details.job_title);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
                } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json : true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (employersResult) {
                    expect(employersResult.response.statusCode).to.equal(201);
                    expect(employersResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(employersResult.body).to.have.property('_id');
                    expect(employersResult.body.auth_details).to.have.property('registereddatetime');
                    expect(employersResult.body.auth_details).to.have.property('last_verification_code');
                    expect(employersResult.body.auth_details).to.have.property('first_login_completed');
                    expect(employersResult.body.auth_details).to.have.property('is_user_verified');
                    expect(employersResult.body.auth_details).to.have.property('is_super');
                    dynamicId = employersResult.body._id;
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json : true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body._id).to.equal(dynamicId);
                    expect(getResult.body.auth_details.last_verification_code).to.equal(testCaseData.expected.auth_details.last_verification_code);
                    expect(getResult.body.auth_details.first_login_completed).to.equal(testCaseData.expected.auth_details.first_login_completed);
                    expect(getResult.body.auth_details.is_user_verified).to.equal(testCaseData.expected.auth_details.is_user_verified);
                    expect(getResult.body.auth_details.is_super).to.equal(testCaseData.expected.auth_details.is_super);
                });
            }
            else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json : true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (employersResult) {
                    expect(employersResult.response.statusCode).to.equal(200);
                    expect(employersResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        json : true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body.auth_details.last_verification_code).to.equal(testCaseData.expected.auth_details.last_verification_code);
                    expect(getResult.body.auth_details.first_login_completed).to.equal(testCaseData.expected.auth_details.first_login_completed);
                    expect(getResult.body.auth_details.is_user_verified).to.equal(testCaseData.expected.auth_details.is_user_verified);
                    expect(getResult.body.auth_details.is_super).to.equal(testCaseData.expected.auth_details.is_super);
                });
            }
            else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                return response.then(function (employersResult) {
                    expect(employersResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (employersResult) {
                    expect(employersResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_FOR_" + tokens[a].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + dynamicId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
    }
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});

