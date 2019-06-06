var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    testSuiteData = {},
    url = baseUrl + "typed/questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("TYPED_QUESTIONS", function () {
    var testSuite = this.title, i, postId, dynamicId;
    describe("TYPED_QUESTIONS_GET", function () {
        var testCases = this.title;
        it("TEST_FOR_BASIC_GET_ALL_TYPED_QUESTIONS", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + testCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                dynamicId = result.body[0].id;
                expect(result.body.length).to.greaterThan(testCaseData.expected.count);
                function typedQuestions(i) {
                    expect(!result.body[i].id).to.be.false;
                    expect(!result.body[i].question).to.be.false;
                    expect(!result.body[i].levelid).to.be.false;
                    expect(!result.body[i].time).to.be.false;
                    expect(!result.body[i].subjectid).to.be.false;
                    var date = new Date(Date.parse(result.body[i].lastmoddatetime));
                    expect(date).to.equal.object;
                }

                for (i = 0; i < result.body.length; i = i + 1) {
                    typedQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ALL_TYPED_QUESTIONS_FILTERING_BY_LEVELID", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + testCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url + "?levelid=" + testCaseData.input.levelid).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body).to.be.instanceof(Array);
                expect(result.body.length).to.greaterThan(testCaseData.expected.count);
                for (i = 0; i < result.body.length; i = i + 1) {
                    expect(!result.body[i].id).to.be.false;
                    expect(result.body[i].levelid).to.be.equal(testCaseData.input.levelid);
                    expect(!result.body[i].time).to.be.false;
                    expect(!result.body[i].subjectid).to.be.false;
                    expect(!result.body[i].question).to.be.false;
                }
            });
        });
        it("TEST_FOR_GET_ONE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + testCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url + '/' + dynamicId).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body.id).to.be.equal(dynamicId);
                expect(!result.body.levelid).to.be.false;
                expect(!result.body.time).to.be.false;
                expect(!result.body.subjectid).to.be.false;
            });
        });
    });

    function execute(val) {
        describe("TYPED_QUESTIONS_POST", function () {
            var postCases = this.title;
            it("TEST_FOR_BASIC_POST_TYPED_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + postCases + '.json'), testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers['content-type']);
                        expect(!result.body.id).to.be.false;
                        expect(result.body.levelid).to.be.equal(testCaseData.input.payload.levelid);
                        expect(result.body.subjectid).to.be.equal(testCaseData.input.payload.subjectid);
                        expect(result.body.question).to.be.equal(testCaseData.input.payload.question);
                        postId = result.body.id;
                        return chakram.get(url + '/' + postId);
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body.id).to.be.equal(postId);
                        expect(getResult.body.levelid).to.be.equal(testCaseData.input.payload.levelid);
                        expect(getResult.body.subjectid).to.be.equal(testCaseData.input.payload.subjectid);
                        expect(getResult.body.question).to.be.equal(testCaseData.input.payload.question);
                    });
                }
                else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                    });
                }
                else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                    });
                }
                else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                    });
                }
            });
        });
        describe("TYPED_QUESTIONS_UPDATE", function () {
            var updateCases = this.title;
            it("TEST_FOR_BASIC_PUT_TYPED_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + updateCases + '.json'), testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.put(url + '/' + postId, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body.levelid).to.be.equal(testCaseData.input.payload.levelid);
                        expect(result.body.subjectid).to.be.equal(testCaseData.input.payload.subjectid);
                        return chakram.get(url + '/' + postId);
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.not.be.null;
                        expect(getResult.body).to.not.be.undefined;
                        expect(getResult.body.id).to.be.equal(postId);
                        expect(getResult.body.levelid).to.be.equal(testCaseData.input.payload.levelid);
                        expect(getResult.body.subjectid).to.be.equal(testCaseData.input.payload.subjectid);
                    });
                }
                else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                    });
                }
                else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                    });
                }
                else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                    });
                }
            });
        });
        describe("TYPED_QUESTIONS_DELETE", function () {
            var deleteCases = this.title;
            it("TEST_FOR_BASIC_DELETE_TYPED_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + deleteCases + '.json'), testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                return chakram.delete(url + '/' + postId, null, {
                    headers: {'x-access-token': tokens[val].token},
                    json: false
                }).then(function (result) {
                    if (tokens[val].role === "SUPER") {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                        return chakram.get(url + '/' + postId, null, {
                            headers: {'x-access-token': tokens[val].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    }
                    else if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                        });
                    }
                    else if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                        });
                    }
                    else if (tokens[val].role === "NEW_USER") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.be.equal(testCaseData.expected['statusCode']);
                        });
                    }
                });
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});





