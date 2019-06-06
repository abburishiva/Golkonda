var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('./tokens'),
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    dynamicId,
    url = baseUrl + "challenges",
    data = require('./data/challengesData.json'),
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CHALLENGES", function () {
    var testSuite = this.title;
    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_CHALLENGES_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(3000000);
            response = chakram.get(url + '?count=10', {
                headers: {'x-access-token': tokens[a].token},
                json: false
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    var challangeDetails = JSON.parse(result.body);
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    if (challangeDetails.length > 0) {
                        expect(challangeDetails[0]).to.have.property('_id');
                        expect(challangeDetails[0]).to.have.property('candidate_id');
                        expect(challangeDetails[0]).to.have.property('quiz').to.have.property('name');
                        expect(challangeDetails[0]).to.have.property('subject').to.have.property('id');
                        expect(challangeDetails[0]).to.have.property('subject').to.have.property('name');
                        expect(challangeDetails[0]).to.have.property('subject').to.have.property('icon');
                        expect(challangeDetails[0]).to.have.property('level').to.have.property('id');
                        expect(challangeDetails[0]).to.have.property('level').to.have.property('name');
                    }
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
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
        it("TEST_FOR_BASIC_GET_CHALLENGE_BY_ID_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url + '/' + testCaseData.input.id, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.body._id).to.equal(testCaseData.input._id);
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
        it("TEST_FOR_BASIC_GET_BY_SUBJECT_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url + '?subject=' + testCaseData.input.subject, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    var found = 0;
                    for (i = 0; i < result.body.length; i = i + 1) {
                        if (result.body[i].subject.name === testCaseData.input.subject) {
                            found = found + 1;
                        }
                    }
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.body.length).to.above(testCaseData.expected.count);
                    expect(found).to.equal(result.body.length);
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
        it("TEST_FOR_BASIC_GET_BY_LEVEL_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url + '?level=' + testCaseData.input.level, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    for (i = 0; i < result.body.length; i = i + 1) {
                        expect(result.body[i].level.name === testCaseData.input.level);
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
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(201);
                    expect(challengesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(challengesResult.body.candidate_id).to.equal(testCaseData.input.candidate_id);
                    expect(challengesResult.body.quiz.name).to.equal(testCaseData.input.quiztype);
                    expect(challengesResult.body.subject.id).to.equal(testCaseData.expected.subject.id);
                    expect(challengesResult.body.level.id).to.equal(testCaseData.input.levelid);
                    dynamicId = challengesResult.body._id;
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body.candidate_id).to.equal(testCaseData.input.candidate_id);
                    expect(getResult.body.quiz.name).to.equal(testCaseData.input.quiztype);
                    expect(getResult.body.subject.id).to.equal(testCaseData.expected.subject.id);
                    expect(getResult.body.level.id).to.equal(testCaseData.input.levelid);
                    expect(getResult.body.time_taken).to.equal(testCaseData.expected.time_taken);
                    expect(getResult.body.attempted).to.equal(testCaseData.expected.attempted);
                    expect(getResult.body.correct).to.equal(testCaseData.expected.correct);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
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
            this.timeout(15000);
            response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(200);
                    expect(challengesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(challengesResult.body.nModified).to.equal(1);
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body.candidate_id).to.equal(testCaseData.input.candidate_id);
                    expect(getResult.body.quiz.name).to.equal(testCaseData.input.quiz.name);
                    expect(getResult.body.subject.id).to.equal(testCaseData.input.subject.id);
                    expect(getResult.body.level.id).to.equal(testCaseData.input.level.id);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
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

