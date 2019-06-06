var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    url = baseUrl + 'candidates',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CANDIDATES", function () {
    var testSuite = this.title,  response,
        i, d, recordId, dynamicId, currentTime, responseTime, responseDate;

    function execute(a) {
        describe("BASIC_GET_ALL_CANDIDATES", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_ALL_CANDIDATES_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '?limit=5', {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        recordId = result.body[0]._id;
                        function candidates(j) {
                            expect(!result.body[j]._id).to.be.false;
                            expect(!result.body[j].auth_details.registereddatetime).to.be.false;
                            expect(!result.body[j].auth_details.first_login_completed).to.be.false;
                            expect(!result.body[j].auth_details.is_user_verified).to.be.false;
                        }
                        for (var a = 0; a < result.body.length; a++) {
                            candidates(a)
                        }
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("BASIC_GET_CANDIDATE_BY_ID", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_CANDIDATE_BY_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + recordId, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body._id).to.equal(recordId);
                        if (result.body.auth_details.first_login_completed.toLowerCase() === 'y') {
                            expect(!result.body.user_profile.email).to.be.false;
                            expect(!result.body.source_details.username).to.be.false;
                        }
                        expect(!result.body.source_details.source).to.be.false;
                        expect(!result.body.auth_details.registereddatetime).to.be.false;
                        expect(!result.body.auth_details.first_login_completed).to.be.false;
                        expect(!result.body.auth_details.is_user_verified).to.be.false;
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidateUrl = baseUrl + 'candidates/' + tokens[a].id,
                        getByIdResponse = chakram.get(candidateUrl, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                    return getByIdResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body._id).to.equal(tokens[a].id);

                        expect(!result.body.source_details.password).to.be.false;
                        expect(!result.body.source_details.source).to.be.false;
                        expect(!result.body.auth_details.last_verification_code).to.be.false;
                        expect(!result.body.auth_details.registereddatetime).to.be.false;
                        if (result.body.auth_details.first_login_completed === 'y') {
                            expect(!result.body.user_profile.email).to.be.false;
                            expect(!result.body.source_details.username).to.be.false;
                        }
                        expect(!result.body.auth_details.first_login_completed).to.be.false;
                        expect(!result.body.auth_details.is_user_verified).to.be.false;
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(401);
                    });
                }
            });
        });
        describe("BASIC_POST", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(candidatesResult.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(candidatesResult.body).to.have.property('_id');
                        dynamicId = candidatesResult.body._id;
                        d = new Date().toISOString();
                        currentTime = d.split(':');
                        responseDate = candidatesResult.body.auth_details.registereddatetime;
                        responseTime = responseDate.split(':');
                        expect(currentTime[0]).to.equal(responseTime[0]);
                        expect(candidatesResult.body.user_profile.email).to.equal(testCaseData.input.user_profile.email);
                        return chakram.get(url + '/' + dynamicId, {
                            headers: {'x-access-token': tokens[a].token},
                            'Content-Type': 'application/json',
                            json: true
                        });
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(getResult.body).to.not.be.null;
                        expect(getResult.body).to.not.be.undefined;
                        expect(getResult.body._id).to.equal(dynamicId);
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(403);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(401);
                    });
                }
            });
        });
        describe("BASIC_PUT", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_PUT_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(candidatesResult.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(candidatesResult.body.nModified).to.be.equal(1);
                        return chakram.get(url + '/' + dynamicId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                    }).then(function (getResult) {
                        responseDate = getResult.body.auth_details.registereddatetime;
                        expect(getResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(getResult.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(getResult.body).to.not.be.undefined;
                        expect(getResult.body._id).to.equal(dynamicId);
                        responseTime = responseDate.split(':');
                        expect(currentTime[0]).to.equal(responseTime[0]);
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var put_url = baseUrl + 'candidates/' + tokens[a].id,
                        updateResponse = chakram.put(put_url, testCaseData.input, {
                            headers: {'x-access-token': tokens[a].token},
                            'Content-Type': 'application/json',
                            json: true
                        });

                    return updateResponse.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(candidatesResult.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(candidatesResult.body.nModified).to.be.equal(1);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (candidatesResult) {
                        expect(candidatesResult.response.statusCode).to.equal(401);
                    });
                }
            });
        });
        describe("BASIC_DELETE", function () {
            it("TEST_FOR_BASIC_DELETE_FOR_" + tokens[a].role, function () {
                this.timeout(30000);
                return chakram.delete(url + '/' + dynamicId, null, {
                    headers: {'x-access-token': tokens[a].token},
                    json: false
                }).then(function (Result) {
                    if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                        expect(Result.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + dynamicId, {
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
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
