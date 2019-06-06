/*global process,describe,it,i,execute*/
/*jslint nomen: true */
/* jshint expr: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('./tokens'),
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    dynamicId,
    url = baseUrl + "infra/email-message",
    data = require('./data/infraEmailsData.json'),
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("INFRA_EMAILS", function () {
    var testSuite = this.title;
    function execute(a) {
        describe(tokens[a].role, function () {
            it("TEST_FOR_IP_SITE_CONTACT_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_IP_SITE_JOB_APPLICATION_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_CANDIDATE_FIRST_LOGIN_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_FORGOT_PASSWORD_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_SIGNUP_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_EMPLOYEE_FIRST_LOGIN_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_VERIFY_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_TEST_COMPLETE_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TS_NEWS_LETTER_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TW_REGISTRATION_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_TW_PASSWORD_RECOVERY_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
            it("TEST_FOR_MASS_EMAIL_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE" || tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body.message_type).to.equal(testCaseData.expected.message_type);
                        expect(result.body.to).to.equal(testCaseData.expected.to);
                        expect(result.body.subject).to.equal(testCaseData.expected.subject);
                        expect(result.body.from).to.equal(testCaseData.expected.from);
                        expect(result.body.engine).to.equal(testCaseData.expected.engine);
                        expect(result.body.test).to.equal(testCaseData.expected.test);
                    });
                }
            });
        });
    }
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});

