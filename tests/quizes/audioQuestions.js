var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "audio/questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("AUDIO_QUESTIONS", function () {
    var testSuite = this.title, response, i, postId, dynamicId;
    this.timeout(30000);
    describe("AUDIO_QUESTIONS_GET", function () {
        var getCases = this.title;
        it("TEST_FOR_BASIC_GET_ALL_AUDIO_QUESTIONS", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url).then(function (result) {
                expect(result.response.statusCode).to.equal(200);
                expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                dynamicId = result.body[0].id;
                expect(result.body.length).to.greaterThan(testCaseData.expected.count);
                function audioQuestions(k) {
                    expect(!result.body[k].id).to.be.false;
                    expect(!result.body[k].question).to.be.false;
                    expect(!result.body[k].levelid).to.be.false;
                    expect(!result.body[k].time).to.be.false;
                    var date = new Date(Date.parse(result.body[k].lastmoddatetime));
                    expect(date).to.be.an.object;
                }

                for (i = 0; i < result.body.length; i = i + 1) {
                    audioQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ALL_AUDIO_QUESTIONS_FILTERING_BY_LEVELID", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url + "?levelid=" + testCaseData.input.levelid).then(function (result) {
                expect(result.response.statusCode).to.equal(200);
                expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body).to.be.instanceof(Array);
                expect(result.body.length).to.greaterThan(testCaseData.expected.count);
                for (i = 0; i < result.body.length; i = i + 1) {
                    expect(!result.body[i].id).to.be.false;
                    expect(result.body[i].levelid).to.be.equal(testCaseData.input.levelid);
                    expect(!result.body[i].question).to.be.false;
                }
            });
        });
        it("TEST_FOR_GET_ONE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url + '/' + dynamicId).then(function (result) {
                expect(result.response.statusCode).to.equal(200);
                expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body.id).to.be.equal(dynamicId);
                expect(!result.body.levelid).to.be.false;
            });
        });
    });


    function execute(val) {
        describe("AUDIO_QUESTIONS_POST", function () {
            var postCases = this.title;
            it("TEST_FOR_BASIC_POST_AUDIO_QUESTIONS_FOR_" + tokens[val].role, function () {
                this.timeout(30000);
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + postCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(201);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(!result.body.id).to.be.false;
                        expect(result.body.levelid).to.be.equal(testCaseData.input.payload.levelid);
                        postId = result.body.id;
                        return chakram.get(url + '/' + postId);
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body.id).to.be.equal(postId);
                        expect(getResult.body.levelid).to.be.equal(testCaseData.input.payload.levelid);
                    });
                } else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(403);
                    });
                } else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(403);
                    });
                } else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(401);
                    });
                }
            });
        });

        describe("AUDIO_QUESTIONS_PUT", function () {
            var UpdateCases = this.title;
            it("TEST_FOR_BASIC_PUT_AUDIO_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + UpdateCases + '.json'), testCaseData = data[testSuite][testCase];
                this.timeout(30000);

                response = chakram.put(url + '/' + postId, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                        return chakram.get(url + '/' + postId);
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.not.be.null;
                        expect(getResult.body).to.not.be.undefined;
                        expect(getResult.body).to.have.property('id', postId);
                        expect(getResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
                    });
                } else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(403);
                    });
                } else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(403);
                    });
                } else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(401);
                    });
                }
            });


            it("TEST_FOR_BASIC_DELETE_AUDIO_QUESTIONS_FOR_" + tokens[val].role, function () {
                this.timeout(30000);
                return chakram.delete(url + '/' + postId, null, {
                    headers: {'x-access-token': tokens[val].token},
                    json: false
                }).then(function (result) {
                    if (tokens[val].role === "SUPER") {
                        expect(result.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + postId, null, {
                            headers: {'x-access-token': tokens[val].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    } else if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(403);
                        });
                    } else if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(403);
                        });
                    } else if (tokens[val].role === "NEW_USER") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(401);
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



