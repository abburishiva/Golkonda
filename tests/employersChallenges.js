var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    data = require('./data/employersChallengesData.json'),
    url = baseUrl + 'employers_challenges',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMPLOYERS_CHALLENGES", function () {
    var testSuite = this.title, d, dynamicId, currentTime, responseTime, responseDate, response, i;
    this.timeout(30000);
    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_EMPLOYERS_CHALLENGES_FOR_" + tokens[a].role, function () {
            this.timeout(30000);
            response = chakram.get(url, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    dynamicId = result.body[0]._id;
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.a('null');
                    expect(result.body).to.not.be.an('undefined');
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
        it("TEST_FOR_BASIC_GET_EMPLOYERS_CHALLENGE_BY_ID_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url + '/' + dynamicId, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.a('null');
                    expect(result.body).to.not.be.an('undefined');
                    expect(result.body._id).to.equal(dynamicId);
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
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(201);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    dynamicId = result.body._id;
                    d = new Date().toISOString();
                    currentTime = d.split(':');
                    responseDate = result.body.lastmoddatetime;
                    responseTime = responseDate.split(':');
                    expect(currentTime[0]).to.equal(responseTime[0]);
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
        it("TEST_FOR_BASIC_PUT_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.a('null');
                    expect(getResult.body).to.not.be.an('undefined');
                    expect(getResult.body._id).to.equal(dynamicId);
                    expect(getResult.body.emp_id).to.equal(testCaseData.expected.emp_id);
                    expect(getResult.body.questions.source).to.equal(testCaseData.expected.questions.source);
                    expect(getResult.body.questions.type).to.equal(testCaseData.expected.questions.type);
                    expect(getResult.body.access.live).to.equal(testCaseData.expected.access.live);
                    expect(getResult.body.access.collaboration).to.equal(testCaseData.expected.access.collaboration);
                    expect(getResult.body.access.screen_sharing).to.equal(testCaseData.expected.access.screen_sharing);
                    expect(getResult.body.access.public).to.equal(testCaseData.expected.access.public);
                    expect(getResult.body.subject.id).to.equal(testCaseData.expected.subject.id);
                    expect(getResult.body.subject.name).to.equal(testCaseData.expected.subject.name);
                    expect(getResult.body.subject.type).to.equal(testCaseData.expected.subject.type);
                    expect(getResult.body.detail.name).to.equal(testCaseData.expected.detail.name);
                    expect(getResult.body.detail.level).to.equal(testCaseData.expected.detail.level);
                    expect(getResult.body.detail.types[0]).to.equal(testCaseData.expected.detail.types[0]);
                    d = new Date().toISOString();
                    currentTime = d.split(':');
                    responseDate = getResult.body.lastmoddatetime;
                    responseTime = responseDate.split(':');
                    expect(currentTime[0]).to.equal(responseTime[0]);
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
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
