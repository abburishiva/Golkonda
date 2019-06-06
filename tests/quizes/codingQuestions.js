var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    data = require('../data/data.json'),
    url = baseUrl + "coding/questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CODING_QUESTIONS", function () {
    var testSuite = this.title, response,
        i, dynamicId, levelidId, subjectId,
        testSuiteData = {}, tesResult, result, verify = true, k;
    it("TEST_FOR_BASIC_GET_ALL_CODING_QUESTIONS", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url).then(function (codingResult) {
            expect(codingResult.response.statusCode).to.equal(200);
            expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(codingResult.body).to.not.be.null;
            expect(codingResult.body).to.not.be.undefined;
            expect(codingResult.body[0]).to.have.property('id');
            expect(codingResult.body[0]).to.have.property('question');
            expect(codingResult.body[0]).to.have.property('subjectid');
            expect(codingResult.body[0]).to.have.property('levelid');
            var d = new Date(codingResult.body[0].lastmoddatetime);
            dynamicId = codingResult.body[0].id;
            levelidId = codingResult.body[0].levelid;
            subjectId = codingResult.body[0].subjectid;
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ALL_CODING_QUESTIONS_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?sort=subjectid').then(function (codingResult) {
            expect(codingResult.response.statusCode).to.equal(200);
            expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(codingResult.body).to.not.be.null;
            expect(codingResult.body).to.not.be.undefined;
            if (codingResult.body.length) {
                var subjectIdArray = codingResult.body.map(function (item) {
                    return item.subjectid;
                });

                function compareSubjectId(currentId, nextId) {
                    return currentId <= nextId;
                }

                for (k = 0; k < subjectIdArray.length - 1; k++) {
                    result = compareSubjectId(subjectIdArray[k], subjectIdArray[k + 1]);
                    expect(codingResult.body).to.not.be.a('null');
                    expect(codingResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                if (verify) {
                    tesResult = compareSubjectId(2, 1);
                    expect(tesResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ALL_CODING_QUESTIONS_FILTERING_BY_LEVELID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?levelid=" + levelidId).then(function (codingResult) {
            expect(codingResult.response.statusCode).to.equal(200);
            expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(codingResult.body).to.not.be.null;
            expect(codingResult.body).to.not.be.undefined;
            expect(codingResult.body).to.be.instanceof(Array);
            expect(codingResult.body.length).to.greaterThan(testCaseData.expected.count);
            for (i = 0; i < codingResult.body.length; i = i + 1) {
                expect(codingResult.body[i]).to.have.property('id');
                expect(codingResult.body[i]).to.have.property('subjectid');
                expect(codingResult.body[i]).to.have.property('levelid', levelidId);
                expect(codingResult.body[i]).to.have.property('question');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, id,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId).then(function (codingResult) {
            expect(codingResult.response.statusCode).to.equal(200);
            expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(codingResult.body).to.not.be.null;
            expect(codingResult.body).to.not.be.undefined;
            expect(codingResult.body).to.have.property('id', dynamicId);
            expect(!codingResult.body.subjectid).to.be.false;
            expect(!codingResult.body.levelid).to.be.false;
        });
    });
    it("TEST_FOR_GET_ALL_CODING_QUESTIONS_FILTERING_BY_SUBJECTID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?subjectid=" + subjectId).then(function (codingResult) {
            expect(codingResult.response.statusCode).to.equal(200);
            expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(codingResult.body).to.not.be.null;
            expect(codingResult.body).to.not.be.undefined;
            expect(codingResult.body).to.be.instanceof(Array);
            expect(codingResult.body.length).to.greaterThan(testCaseData.expected.count);
            for (i = 0; i < codingResult.body.length; i = i + 1) {
                expect(codingResult.body[i]).to.have.property('id');
                expect(codingResult.body[i]).to.have.property('subjectid');
                expect(codingResult.body[i]).to.have.property('levelid');
            }
        });
    });
    it("TEST_FOR_GET_ALL_CODING_QUESTIONS_SORT_BY_ID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?type=all&sort=id').then(function (codingResult) {
            expect(codingResult.response.statusCode).to.equal(200);
            expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(codingResult.body).to.not.be.null;
            expect(codingResult.body).to.not.be.undefined;


            if (codingResult.body.length) {
                var idArray = codingResult.body.map(function (item) {
                    return item.id;
                });

                function compareId(currentId, nextId) {
                    return currentId <= nextId;
                }

                for (k = 0; k < idArray.length - 1; k++) {
                    result = compareId(idArray[k], idArray[k + 1]);
                    expect(codingResult.body).to.not.be.a('null');
                    expect(codingResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                if (verify) {
                    tesResult = compareId(2, 1);
                    expect(tesResult).to.be.false;
                }
            }
        });
    });
    function execute(val) {
        it("TEST_FOR_BASIC_POST_CODING_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "SUPER") {
                return response.then(function (codingResult) {
                    expect(codingResult.response.statusCode).to.equal(201);
                    expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(codingResult.body).to.have.property('id');
                    expect(codingResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(codingResult.body).to.have.property("levelid", testCaseData.input.payload.levelid);
                    testSuiteData.dynamicId = codingResult.body.id;
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
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "NEW_USER") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(401);
                    });
                }
            }
        });
        it("TEST_FOR_BASIC_PUT_CODING_QUESTIONS_FOR_" + tokens[val].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[val].token},
                json: true
            });
            if (tokens[val].role === "SUPER") {
                return response.then(function (codingResult) {
                    expect(codingResult.response.statusCode).to.equal(200);
                    expect(codingResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(codingResult.body).to.have.property('subjectid', testCaseData.input.payload.subjectid);
                    expect(codingResult.body).to.have.property('levelid', testCaseData.input.payload.levelid);
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
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(403);
                    });
                }
                if (tokens[val].role === "NEW_USER") {
                    return response.then(function (choiceResult) {
                        expect(choiceResult.response.statusCode).to.equal(401);
                    });
                }
            }
        });
        it("TEST_FOR_BASIC_DELETE_CODING_QUESTIONS_FOR_" + tokens[val].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[val].token},
                json: false
            }).then(function (codingResult) {
                if (tokens[val].role === "SUPER") {
                    expect(codingResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[val].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else {
                    if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (choiceResult) {
                            expect(choiceResult.response.statusCode).to.equal(403);
                        });
                    }
                    if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (choiceResult) {
                            expect(choiceResult.response.statusCode).to.equal(403);
                        });
                    }
                    if (tokens[val].role === "NEW_USER") {
                        return response.then(function (choiceResult) {
                            expect(choiceResult.response.statusCode).to.equal(401);
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





