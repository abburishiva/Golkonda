/*global process,describe,it,i,execute*/
/*jslint nomen: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    data = require('./data/authUsersData.json'),
    url = baseUrl + 'auth/users',
    loginUrl = baseUrl + 'user/authenticate',
    signUpUrl = baseUrl + 'user/register',
    candidatesUrl = baseUrl + 'candidates',
    employersUrl = baseUrl + 'employers',
    tokens = token.tokens;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("AUTH_USERS", function () {
    var testSuite = this.title, i, candidateId, employeeId, response;
    this.timeout(30000);
    it("TEST_FOR_BASIC_POST_NEW_CANDIDATE_TO_TALENT_USERS_THROUGH_SIGN_UP", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        response = chakram.post(signUpUrl, testCaseData.input);
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
            expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);
        });
    });
    it("TEST_FOR_BASIC_POST_NEW_EMPLOYEE_TO_TALENT_USERS_THROUGH_SIGN_UP", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(signUpUrl, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
            expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
            expect(result.body.data.status).to.equal(testCaseData.expected.data.status);
        });
    });
    function execute(a) {
        it("TEST_FOR_GET_NEWLY_REGISTERED_CANDIDATE_IN_CANDIDATES_TABLE_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(90000);
            response = chakram.get(candidatesUrl + '?limit=5&email=' + testCaseData.input.email, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    candidateId = result.body[0]._id;
                    response = chakram.put(candidatesUrl + '/' + candidateId, testCaseData.input.payload, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return response.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(200);
                        expect(candidatesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        response = chakram.get(candidatesUrl + '/' + candidateId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                        return response.then(function (getResult) {
                            expect(getResult.body.source_details.source).to.equal(testCaseData.expected.source_details.source);
                            expect(getResult.body.source_details.password).to.equal(testCaseData.expected.source_details.password);
                            expect(getResult.body.source_details.username).to.equal(testCaseData.expected.source_details.username);
                            expect(getResult.body.user_profile.name).to.equal(testCaseData.expected.user_profile.name);
                            expect(getResult.body.user_profile.email).to.equal(testCaseData.expected.user_profile.email);
                            expect(getResult.body.user_profile.phone).to.equal(testCaseData.expected.user_profile.phone);
                            expect(getResult.body.user_profile.country_name).to.equal(testCaseData.expected.user_profile.country_name);
                        });
                    });
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(204);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_DELETING_THE_CANDIDATE_RECORD_FROM_CANDIDATES_TABLE_FOR_" + tokens[a].role, function () {
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
                } else if (tokens[a].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
        it("TEST_FOR_VERIFYING_THE_CANDIDATE_RECORD_DELETED_IN_TALENT_USERS_COLLECTION", function () {
            this.timeout(30000);
            var testcase = this.test.title, testCaseData = data[testSuite][testcase];
            return chakram.post(loginUrl, testCaseData.input).then(function (result) {
                expect(result.body.message).to.equal(testCaseData.expected.message);
            });
        });
        it("TEST_FOR_GET_NEWLY_REGISTERED_EMPLOYEE_IN_EMPLOYERS_TABLE_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(employersUrl + '?email=' + testCaseData.input.email, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    employeeId = result.body[0]._id;
                    response = chakram.put(employersUrl + '/' + employeeId, testCaseData.input.payload, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return response.then(function (employersResult) {
                        expect(employersResult.response.statusCode).to.equal(200);
                        expect(employersResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        response = chakram.get(employersUrl + '?email=' + testCaseData.input.email, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                        return response.then(function (getResult) {
                            expect(getResult.body[0].employer_details.company_name).to.equal(testCaseData.expected.employer_details.company_name);
                            expect(getResult.body[0].employer_details.country_name).to.equal(testCaseData.expected.employer_details.country_name);
                            expect(getResult.body[0].employer_details.company_size).to.equal(testCaseData.expected.employer_details.company_size);
                            expect(getResult.body[0].employer_details.job_title).to.equal(testCaseData.expected.employer_details.job_title);
                            expect(getResult.body[0].source_details.source).to.equal(testCaseData.expected.source_details.source);
                            expect(getResult.body[0].source_details.password).to.equal(testCaseData.expected.source_details.password);
                            expect(getResult.body[0].source_details.username).to.equal(testCaseData.expected.source_details.username);
                            expect(getResult.body[0].user_profile.phone).to.equal(testCaseData.expected.user_profile.phone);
                            expect(getResult.body[0].user_profile.name).to.equal(testCaseData.expected.user_profile.name);
                            expect(getResult.body[0].user_profile.email).to.equal(testCaseData.expected.user_profile.email);
                        });
                    });
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
        it("TEST_FOR_DELETING_THE_EMPLOYEE_RECORD_FROM_EMPLOYERS_TABLE_FOR_" + tokens[a].role, function () {
            return chakram.delete(employersUrl + '/' + employeeId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(employersUrl + '/' + employeeId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }
            });
        });
        it("TEST_FOR_VERIFYING_THE_EMPLOYEE_RECORD_DELETED_IN_TALENT_USERS_COLLECTION", function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            return chakram.post(loginUrl, testCaseData.input).then(function (result) {
                expect(result.body.message).to.equal(testCaseData.expected.message);
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
