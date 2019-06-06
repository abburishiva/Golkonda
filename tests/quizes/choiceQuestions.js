/*global process,describe,it,execute,i*/
/* jshint expr: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    testSuiteData = {},
    dynamicId,
    data = require('../data/data.json'),
    url = baseUrl + "choice/questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CHOICE_QUESTIONS", function () {
    var testSuite = this.title,
        k,
        dynamicId,
        testSuiteData = {};
    it("TEST_FOR_BASIC_GET_ALL_CHOICE_QUESTIONS", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url).then(function (choiceResult) {
            expect(choiceResult.response.statusCode).to.equal(200);
            expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(choiceResult.body).to.not.be.null;
            expect(choiceResult.body).to.not.be.undefined;
            expect(choiceResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(choiceResult.body[0]).to.have.property('id');
            expect(choiceResult.body[0]).to.have.property('question');
            expect(choiceResult.body[0]).to.have.property('subjectid');
            expect(choiceResult.body[0]).to.have.property('levelid');
            var d = new Date(choiceResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
            dynamicId = choiceResult.body[0].id;
        });
    });
    it("TEST_FOR_GET_ALL_CHOICE_QUESTIONS_BY_SORTING", function () {
        var testCase = this.test.title,
            verify,
            tesResult,
            result,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?sort=subjectid').then(function (choiceResult) {
            expect(choiceResult.response.statusCode).to.equal(200);
            expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(choiceResult.body).to.not.be.null;
            expect(choiceResult.body).to.not.be.undefined;
            if (choiceResult.body.length) {
                var subjectIdArray = choiceResult.body.map(function (item) {
                    return item.subjectid;
                });

                function compareSubjectId(currentEntityId, nextEntityId) {
                    return currentEntityId <= nextEntityId;
                }

                for (k = 0; k < subjectIdArray.length - 1; k++) {
                    result = compareSubjectId(subjectIdArray[k], subjectIdArray[k + 1]);
                    expect(choiceResult.body).to.not.be.a('null');
                    expect(choiceResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                if (verify) {
                    tesResult = compareSubjectId(2, 1);
                    expect(tesResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ALL_CHOICE_QUESTIONS_FILTERING_BY_LEVELID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?levelid=" + testCaseData.input.levelid).then(function (choiceResult) {
            expect(choiceResult.response.statusCode).to.equal(200);
            expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(choiceResult.body).to.not.be.null;
            expect(choiceResult.body).to.not.be.undefined;
            expect(choiceResult.body).to.be.instanceof(Array);
            expect(choiceResult.body.length).to.greaterThan(testCaseData.expected.count);
            for (i = 0; i < choiceResult.body.length; i = i + 1) {
                expect(choiceResult.body[i]).to.have.property('id');
                expect(choiceResult.body[i]).to.have.property('subjectid');
                expect(choiceResult.body[i]).to.have.property('levelid', testCaseData.input.levelid);
                expect(choiceResult.body[i]).to.have.property('question');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, id,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + dynamicId).then(function (choiceResult) {
            expect(choiceResult.response.statusCode).to.equal(200);
            expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(choiceResult.body).to.not.be.null;
            expect(choiceResult.body).to.not.be.undefined;
            expect(choiceResult.body).to.have.property('id', dynamicId);
            expect(!choiceResult.body.subjectid).to.be.false;
            expect(!choiceResult.body.levelid).to.be.false;
        });
    });
    it("TEST_FOR_GET_ALL_CHOICE_QUESTIONS_FILTERING_BY_SUBJECTID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?subjectid=" + testCaseData.input.subjectid).then(function (choiceResult) {
            expect(choiceResult.response.statusCode).to.equal(200);
            expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(choiceResult.body).to.not.be.null;
            expect(choiceResult.body).to.not.be.undefined;
            expect(choiceResult.body).to.be.instanceof(Array);
            expect(choiceResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(choiceResult.body[0]).to.have.property('id');
            expect(choiceResult.body[1].subjectid).to.equal(testCaseData.input.subjectid);
            expect(choiceResult.body[2]).to.have.property('levelid');
        });
    });

    function execute(val) {
        it("TEST_FOR_BASIC_POST_CHOICE_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "SUPER") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(201);
                    expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(choiceResult.body).to.have.property('id');
                    expect(choiceResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(choiceResult.body).to.have.property("levelid", testCaseData.input.payload.levelid);
                    testSuiteData.dynamicId = choiceResult.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(getResult.body).to.have.property("levelid", testCaseData.input.payload.levelid);
                });
            }
            else if (tokens[val].role === "EMPLOYEE") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[val].role === "CANDIDATE") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[val].role === "NEW_USER") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_CHOICE_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "SUPER") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(200);
                    expect(choiceResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(choiceResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(choiceResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
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
            }
            else if (tokens[val].role === "EMPLOYEE") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[val].role === "CANDIDATE") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[val].role === "NEW_USER") {
                return response.then(function (choiceResult) {
                    expect(choiceResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_CHOICE_QUESTIONS_FOR_" + tokens[val].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[val].token},
                json: false
            }).then(function (choiceResult) {
                if (tokens[val].role === "SUPER") {
                    expect(choiceResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[val].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                }
                else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(403);
                    });
                }
                else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(403);
                    });
                }
                else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(401);
                    });
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});





