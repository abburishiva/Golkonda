var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    data = require('../data/data.json'),
    url = baseUrl + "video/questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("VIDEO_QUESTIONS", function () {
    var response, testSuite = this.title,
        testSuiteData = {}, i, dynamicId, levelId, subjectId;
    it("TEST_FOR_BASIC_GET_ALL_VIDEO_QUESTIONS", function () {
        var testCase = this.test.title, d,
            testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url).then(function (videoResult) {
            expect(videoResult.response.statusCode).to.equal(200);
            expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(videoResult.body).to.not.be.null;
            expect(videoResult.body).to.not.be.undefined;
            expect(videoResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(videoResult.body[0]).to.have.property('id');
            expect(videoResult.body[0]).to.have.property('question');
            expect(videoResult.body[0]).to.have.property('subjectid');
            expect(videoResult.body[0]).to.have.property('levelid');
            dynamicId = videoResult.body[0].id;
            levelId = videoResult.body[0].levelid;
            subjectId = videoResult.body[0].subjectid;
            d = new Date(videoResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ALL_VIDEO_QUESTIONS_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(10000);
        return chakram.get(url + '?sort=subjectid').then(function (videoResult) {
            expect(videoResult.response.statusCode).to.equal(200);
            expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(videoResult.body).to.not.be.null;
            expect(videoResult.body).to.not.be.undefined;
            expect(videoResult.body[0]).to.have.property('id');
            expect(videoResult.body[0]).to.have.property('subjectid');
            expect(videoResult.body[0]).to.have.property('levelid');
        });
    });
    it("TEST_FOR_GET_ALL_VIDEO_QUESTIONS_FILTERING_BY_LEVELID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?levelid=" + levelId).then(function (videoResult) {
            expect(videoResult.response.statusCode).to.equal(200);
            expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(videoResult.body).to.not.be.null;
            expect(videoResult.body).to.not.be.undefined;
            expect(videoResult.body).to.be.instanceof(Array);
            expect(videoResult.body.length).to.greaterThan(testCaseData.expected.count);
            for (i = 0; i < videoResult.body.length; i = i + 1) {
                expect(videoResult.body[i]).to.have.property('id');
                expect(videoResult.body[i]).to.have.property('subjectid');
                expect(videoResult.body[i]).to.have.property('levelid', levelId);
                expect(videoResult.body[i]).to.have.property('question');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, id,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId).then(function (videoResult) {
            expect(videoResult.response.statusCode).to.equal(200);
            expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(videoResult.body).to.not.be.null;
            expect(videoResult.body).to.not.be.undefined;
            expect(videoResult.body).to.have.property('id', dynamicId);
            expect(!videoResult.body.subjectid).to.be.false;
            expect(!videoResult.body.levelid).to.be.false;
            expect(!videoResult.body.question).to.be.false;
            expect(!videoResult.body.time).to.be.false;
            expect(!videoResult.body.questiontype).to.be.false;
        });
    });
    it("TEST_FOR_GET_ALL_VIDEO_QUESTIONS_FILTERING_BY_SUBJECTID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?subjectid=" + subjectId).then(function (videoResult) {
            expect(videoResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
            expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(videoResult.body).to.not.be.null;
            expect(videoResult.body).to.not.be.undefined;
            expect(videoResult.body).to.be.instanceof(Array);
            for (i = 0; i < videoResult.body.length; i = i + 1) {
                expect(videoResult.body[i]).to.have.property('id');
                expect(videoResult.body[i]).to.have.property('subjectid', subjectId);
                expect(videoResult.body[i]).to.have.property('levelid');
            }
        });
    });
    function execute(val) {
        it("TEST_FOR_BASIC_POST_VIDEO_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "super") {
                return response.then(function (videoResult) {
                    expect(videoResult.response.statusCode).to.equal(201);
                    expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(videoResult.body).to.have.property('id');
                    expect(videoResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(videoResult.body).to.have.property("levelid", testCaseData.input.payload.levelid);
                    testSuiteData.dynamicId = videoResult.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(getResult.body).to.have.property("levelid", testCaseData.input.payload.levelid);
                });
            } else {
                if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "NEW_USER") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(401);
                    });
                }
            }
        });
        it("TEST_FOR_BASIC_PUT_VIDEO_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "super") {
                return response.then(function (videoResult) {
                    expect(videoResult.response.statusCode).to.equal(200);
                    expect(videoResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(videoResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(videoResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(getResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                });
            } else {
                if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "NEW_USER") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(401);
                    });
                }
            }

        });
        it("TEST_FOR_BASIC_DELETE_VIDEO_QUESTIONS_FOR_" + tokens[val].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[val].token},
                json: false
            }).then(function (videoResult) {
                if (tokens[val].role === "super") {
                    expect(videoResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[val].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else {
                    if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (videoResult) {
                            expect(videoResult.response.statusCode).to.equal(403);
                        });
                    }
                    if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (videoResult) {
                            expect(videoResult.response.statusCode).to.equal(403);
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





