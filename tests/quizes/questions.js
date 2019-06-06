var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    data = require('../data/data.json'),
    url = baseUrl + "questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("QUESTIONS", function () {
    var testSuite = this.title,
        testSuiteData = {}, dynamicId,questiontype;
    it("TEST_FOR_BASIC_GET_ALL_QUESTIONS", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url).then(function (questionResult) {
            expect(questionResult.response.statusCode).to.equal(200);
            expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(questionResult.body).to.not.be.null;
            expect(questionResult.body).to.not.be.undefined;
            expect(questionResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(questionResult.body[0]).to.have.property('id');
            expect(questionResult.body[0]).to.have.property('question');
            expect(questionResult.body[0]).to.have.property('subjectid');
            expect(questionResult.body[0]).to.have.property('levelid');
            dynamicId = questionResult.body[0].id;
            questiontype=questionResult.body[0].questiontype;
            var d = new Date(questionResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '/' + dynamicId + "?questiontype=" + questiontype).then(function (questionResult) {
            expect(questionResult.response.statusCode).to.equal(200);
            expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(questionResult.body).to.not.be.null;
            expect(questionResult.body).to.not.be.undefined;
            expect(questionResult.body.id).to.be.equal(dynamicId);
            expect(!questionResult.body.subjectid).to.be.false;
            expect(!questionResult.body.levelid).to.be.false;
            expect(!questionResult.body.questiontype).to.be.false;
            expect(!questionResult.body.question).to.be.false;
        });
    });
    it("TEST_FOR_GET_ALL_QUESTIONS_FILTERING_BY_LEVELID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?questiontype=video" + "&levelid=" + testCaseData.input.levelid).then(function (questionResult) {
            expect(questionResult.response.statusCode).to.equal(200);
            expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(questionResult.body).to.not.be.null;
            expect(questionResult.body).to.not.be.undefined;
            expect(questionResult.body).to.be.instanceof(Array);
            expect(questionResult.body.length).to.greaterThan(testCaseData.expected.count);
            for (i = 0; i < questionResult.body.length; i = i + 1) {
                expect(questionResult.body[i]).to.have.property('id');
                expect(questionResult.body[i]).to.have.property('subjectid');
                expect(questionResult.body[i]).to.have.property('levelid', testCaseData.input.levelid);
                expect(questionResult.body[i]).to.have.property('question');
            }
        });
    });
    it("TEST_FOR_GET_ALL_QUESTIONS_FILTERING_BY_SUBJECTID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?questiontype=video" + "&subjectid=" + testCaseData.input.subjectid).then(function (questionResult) {
            expect(questionResult.response.statusCode).to.equal(200);
            expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(questionResult.body).to.not.be.null;
            expect(questionResult.body).to.not.be.undefined;
            expect(questionResult.body).to.be.instanceof(Array);
            for (i = 0; i < questionResult.body.length; i = i + 1) {
                expect(questionResult.body[i]).to.have.property('id');
                expect(questionResult.body[i]).to.have.property('subjectid', testCaseData.input.subjectid);
                expect(questionResult.body[i]).to.have.property('levelid');
            }
        });
    });
    function execute(val) {
        it("TEST_FOR_BASIC_POST_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            response = chakram.post(url + '?questiontype=video', testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "SUPER") {
                return response.then(function (questionResult) {
                    expect(questionResult.response.statusCode).to.equal(201);
                    expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(questionResult.body).to.have.property('id');
                    expect(questionResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(questionResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                    expect(questionResult.body).to.have.property('question', testCaseData.input.payload.question);
                    testSuiteData.dynamicId = questionResult.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId + "?questiontype=video");
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body.id).to.be.equal(testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(getResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                    expect(getResult.body).to.have.property('question', testCaseData.input.payload.question);
                });
            } else {
                if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (questionResult) {
                        expect(questionResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (questionResult) {
                        expect(questionResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "NEW_USER") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(401);
                    });
                }
            }

        });
        it("TEST_FOR_BASIC_PUT_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "super") {
                return response.then(function (questionResult) {
                    expect(questionResult.response.statusCode).to.equal(200);
                    expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(questionResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(questionResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                    expect(questionResult.body).to.have.property('question', testCaseData.input.payload.question);
                    return chakram.get(url + '/' + testSuiteData.dynamicId + "?questiontype=video");
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(getResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                    expect(getResult.body).to.have.property('question', testCaseData.input.payload.question);
                });
            } else {
                if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (questionResult) {
                        expect(questionResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (questionResult) {
                        expect(questionResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "NEW_USER") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(401);
                    });
                }
            }

        });
        it("TEST_FOR_BASIC_DELETE_QUESTIONS_FOR_" + tokens[val].role, function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId + "?questiontype=video", null, {
                headers: {'x-access-token': tokens[val].token},
                json: false
            }).then(function (questionResult) {
                if (tokens[val].role === "super") {
                    expect(questionResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId + "?questiontype=video", null, {
                        headers: {'x-access-token': tokens[val].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else {
                    if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (questionResult) {
                            expect(questionResult.response.statusCode).to.equal(403);
                        });
                    }
                    if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (questionResult) {
                            expect(questionResult.response.statusCode).to.equal(403);
                        });
                    }
                    if (tokens[val].role === "NEW_USER") {
                        return response.then(function (videoResult) {
                            expect(videoResult.response.statusCode).to.equal(401);
                        });
                    }
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
