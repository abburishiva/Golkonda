var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    request = require('request'),
    fs = require('fs'),
    token = require('./tokens'),
    url = baseUrl + 'resume/permissions',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("RESUME_PERMISSIONS", function () {
    var testSuite = this.title, i;
    this.timeout(60000);
    function execute(a) {
        describe("TEST_FOR_BASIC_GET_ALL", function () {
            var getCases = this.title, response;
            it('TEST_FOR_BASIC_GET_ALL_FOR_' + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.get(url, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        expect(result.body[0]).to.not.be.a('null');
                        expect(result.body[0]).to.not.be.an('undefined');
                        if (result.body.length > 0) {
                            expect(result.body[0]).to.have.property('_id');
                            expect(result.body[0]).to.have.property('resumeId');
                        }
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_HAS_ONE_WORD", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_HAS_ONE_WORD_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'),
                    testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });

        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_HAS_THREE_WORDS", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_HAS_THREE_WORDS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_HAS_TWO_WORDS", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_HAS_TWO_WORDS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_ARE_SAME_AND_HAS_SINGLE_WORD_EACH", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_ARE_SAME_AND_HAS_SINGLE_WORD_EACH_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_ARE_SAME_AND_HAS_TWO_WORD_EACH_WITH_SINGLE_CHARACTER", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_ARE_SAME_AND_HAS_TWO_WORD_EACH_WITH_SINGLE_CHARACTER_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_FOUR_WORDS_AND_RESUME_NAME_HAS_THREE_WORDS", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_FOUR_WORDS_AND_RESUME_NAME_HAS_THREE_WORDS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_LENGTH_OF_CANDIDATE_NAME_IS_GREATER_THAN_LENGTH_OF_RESUME_NAME", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_LENGTH_OF_CANDIDATE_NAME_IS_GREATER_THAN_LENGTH_OF_RESUME_NAME_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_LENGTH_OF_CANDIDATE_NAME_IS_LESS_THAN_LENGTH_OF_RESUME_NAME", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_LENGTH_OF_CANDIDATE_NAME_IS_LESS_THAN_LENGTH_OF_RESUME_NAME_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_ONE_WORD_AND_RESUME_NAME_HAS_THREE_WORDS", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_ONE_WORD_AND_RESUME_NAME_HAS_THREE_WORDS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_ONE_WORD_AND_RESUME_NAME_HAS_TWO_WORDS", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_ONE_WORD_AND_RESUME_NAME_HAS_TWO_WORDS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_HAS_TWO_WORDS_EACH_AND_BOTH_ARE_SIMILAR", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_HAS_TWO_WORDS_EACH_AND_BOTH_ARE_SIMILAR_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_HAS_TWO_WORDS_EACH_AND_BUT_LENGTH_OF_RESUME_NAME_IS_GREATER_THAN_CANDIDATE_NAME", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_AND_RESUME_NAME_HAS_TWO_WORDS_EACH_AND_BUT_LENGTH_OF_RESUME_NAME_IS_GREATER_THAN_CANDIDATE_NAME_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_THREE_WORDS_AND_RESUME_NAME_IS_ANYTHING", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_THREE_WORDS_AND_RESUME_NAME_IS_ANYTHING_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_IS_ANYTHING", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_CANDIDATE_NAME_HAS_TWO_WORDS_AND_RESUME_NAME_IS_ANYTHING_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("TEST_FOR_GET_SHORT_UID_WHEN_OBTAINED_SHORT_UID_LENGTH_IS_EQUAL_TO_SHORT_UID'S_MAXIMUM_LENGTH", function () {
            var getCases = this.title, response;
            it("TEST_FOR_GET_SHORT_UID_WHEN_OBTAINED_SHORT_UID_LENGTH_IS_EQUAL_TO_SHORT_UID'S_MAXIMUM_LENGTH_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
                response = chakram.post(url, {"resumeId": testCaseData.input.resumeId}, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.headers["content-type"]).to.equal(testCaseData.expected.headers["content-type"]);
                        response = chakram.delete(url + '/' + testCaseData.input.resumeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        });
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});