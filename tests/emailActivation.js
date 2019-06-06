/*global process,describe,it,i,execute*/
/*jslint nomen: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    data = require('./data/emailActivationData.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + 'emailactivation',
    signupUrl = baseUrl + 'user' + '/register',
    userAuthenticateUrl = baseUrl + 'user' + '/authenticate',
    candidatesUrl = baseUrl + 'candidates',
    employeesUrl = baseUrl + 'employers',
    token = require('./tokens'),
    tokens = token.tokens,
    candidate = baseUrl + 'candidates';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMAIL_ACTIVATION", function () {
    var testSuite = this.title, i, response, verificationCode, candidateId, employeeId;
    this.timeout(30000);
    it("TEST_FOR_NEW_CANDIDATE_SIGN_UP", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(signupUrl, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
            expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);
        });
    });
    it("TEST_FOR_NEW_EMPLOYEE_REGISTER", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(signupUrl, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
            expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
        });
    });
    it("TEST_FOR_ACCOUNT_ACTIVATION_FOR_NEWLY_REGISTERED_CANDIDATE_WITH_INCORRECT_VERIFICATION_CODE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        chakram.wait(30000);
        return chakram.post(userAuthenticateUrl, {
            "email_address": testCaseData.input.email,
            "verification_code": testCaseData.input.verificationCode,
            "app_type": "talentScreen",
            "type": "accountActivation"
        }).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);
        });
    });
    function execute(i) {
        it("TEST_FOR_ACCOUNT_ACTIVATION_FOR_NEWLY_REGISTERED_CANDIDATE_FOR_" + tokens[i].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            response = chakram.get(candidatesUrl + '?limit=5&email=' + testCaseData.input.email, {
                headers: {'x-access-token': tokens[i].token},
                json: true
            });
            if (tokens[i].role === "SUPER" || tokens[i].role === "EMPLOYEE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.a('null');
                    expect(result.body).to.not.be.an('undefined');
                    verificationCode = result.body[0].auth_details.last_verification_code;
                    candidateId = result.body[0]._id;
                    return chakram.post(userAuthenticateUrl, {
                        "email_address": testCaseData.input.email,
                        "verification_code": verificationCode,
                        "app_type": testCaseData.input.app_type,
                        "type": testCaseData.input.type
                    }).then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        response = chakram.put(candidatesUrl + '/' + candidateId, testCaseData.input.payload, {
                            headers: {'x-access-token': tokens[i].token},
                            'Content-Type': 'application/json',
                            json: true
                        });
                        return response.then(function (candidatesResult) {
                            expect(candidatesResult.response.statusCode).to.equal(200);
                            expect(candidatesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        });
                    });
                });
            }
            else if (tokens[i].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[i].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_ACCOUNT_ACTIVATION_FOR_NEWLY_REGISTERED_EMPLOYEE_FOR_" + tokens[i].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            response = chakram.get(employeesUrl + '?email=' + testCaseData.input.email, {
                headers: {'x-access-token': tokens[i].token},
                json: true
            });
            if (tokens[i].role === "SUPER") {
                return response.then(function (result) {

                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.a('null');
                    expect(result.body).to.not.be.an('undefined');
                    verificationCode = result.body[0].auth_details.last_verification_code;
                    employeeId = result.body[0]._id;
                    return chakram.post(userAuthenticateUrl, {
                        "email_address": testCaseData.input.email,
                        "verification_code": verificationCode,
                        "app_type": testCaseData.input.app_type,
                        "type": testCaseData.input.type
                    }).then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        response = chakram.put(employeesUrl + '/' + employeeId, testCaseData.input.payload, {
                            headers: {'x-access-token': tokens[i].token},
                            'Content-Type': 'application/json',
                            json: true
                        });
                        return response.then(function (candidatesResult) {
                            expect(candidatesResult.response.statusCode).to.equal(200);
                            expect(candidatesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        });
                    });
                });
            }
            else if (tokens[i].role === "EMPLOYEE" || tokens[i].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[i].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
    it("TEST_FOR_LOGIN_FOR_NEWLY_REGISTERED_CANDIDATE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(userAuthenticateUrl, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.userData.demo_details.choice_demo).to.equal(testCaseData.expected.userData.demo_details.choice_demo);
            expect(result.body.userData.demo_details.coding_demo).to.equal(testCaseData.expected.userData.demo_details.coding_demo);
            expect(result.body.userData.demo_details.video_demo).to.equal(testCaseData.expected.userData.demo_details.video_demo);
            expect(result.body.userData.auth_details.first_login_completed).to.equal(testCaseData.expected.userData.auth_details.first_login_completed);
            expect(result.body.userData.auth_details.is_user_verified).to.equal(testCaseData.expected.userData.auth_details.is_user_verified);
            expect(result.body.userData.user_profile.name).to.equal(testCaseData.expected.userData.user_profile.name);
            expect(result.body.userData.user_profile.email).to.equal(testCaseData.expected.userData.user_profile.email);
            expect(result.body.userData.user_profile.phone).to.equal(testCaseData.expected.userData.user_profile.phone);
            expect(result.body.userData.user_profile.country_name).to.equal(testCaseData.expected.userData.user_profile.country_name);
            expect(result.body.userData.role).to.equal(testCaseData.expected.userData.role);
            expect(result.body.token).to.not.to.be.a('null');
        });
    });
    it("TEST_FOR_LOGIN_FOR_NEWLY_REGISTERED_EMPLOYEE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(userAuthenticateUrl, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);
            expect(result.body.userData.employer_details._id).to.equal(testCaseData.expected.userData.employer_details._id);
            expect(result.body.userData.auth_details.first_login_completed).to.equal(testCaseData.expected.userData.auth_details.first_login_completed);
            expect(result.body.userData.auth_details.is_user_verified).to.equal(testCaseData.expected.userData.auth_details.is_user_verified);
            expect(result.body.userData.auth_details.is_super).to.equal(testCaseData.expected.userData.auth_details.is_super);
            expect(result.body.userData.employer_details.company_name).to.equal(testCaseData.expected.userData.employer_details.company_name);
            expect(result.body.userData.employer_details.company_size).to.equal(testCaseData.expected.userData.employer_details.company_size);
            expect(result.body.userData.employer_details.job_title).to.equal(testCaseData.expected.userData.employer_details.job_title);
            expect(result.body.userData.employer_details.country_name).to.equal(testCaseData.expected.userData.employer_details.country_name);
            expect(result.body.userData.user_profile.name).to.equal(testCaseData.expected.userData.user_profile.name);
            expect(result.body.userData.user_profile.email).to.equal(testCaseData.expected.userData.user_profile.email);
            expect(result.body.userData.user_profile.phone).to.equal(testCaseData.expected.userData.user_profile.phone);
            expect(result.body.userData.role).to.equal(testCaseData.expected.userData.role);
            expect(result.body.token).to.not.to.be.a('null');
        });
    });
    it("TEST_FOR_INVALID_USER", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        chakram.wait(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.body.message).to.equal(testCaseData.expected.message);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
        });
    });
    function deleteUser(a) {
        it("TEST_FOR_DELETE_NEWLY_REGISTERED_CANDIDATE_BY_ID_FOR_" + tokens[a].role, function () {
            this.timeout(30000);
            return chakram.delete(candidatesUrl + '/' + candidateId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(candidatesUrl + '/' + candidateId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }
            });
        });
        it("TEST_FOR_DELETE_NEWLY_REGISTERED_EMPLOYEE_BY_ID_FOR_" + tokens[a].role, function () {
            this.timeout(30000);
            return chakram.delete(employeesUrl + '/' + employeeId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(employeesUrl + '/' + employeeId, {
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
        deleteUser(i);
    }
});
