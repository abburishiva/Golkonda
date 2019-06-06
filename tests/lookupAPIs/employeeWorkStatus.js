/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    tokens = token.tokens,
    data = require('../data/data.json'),
    i,
    url = baseUrl + "lookup/work/statuses";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOOKUP_WORK_STATUS", function () {
    var testSuite = this.title, testSuiteData = {};
    it("TEST_FOR_BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?limit=50').then(function (workStatusResult) {
            expect(workStatusResult.response.statusCode).to.equal(200);
            expect(workStatusResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(workStatusResult.body).to.not.be.null;
            expect(workStatusResult.body).to.not.be.undefined;
            expect(workStatusResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(workStatusResult.body[0]).to.have.property('id');
            expect(workStatusResult.body[0]).to.have.property('name');
            expect(workStatusResult.body[0]).to.have.property('description');
            var d = new Date(workStatusResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ALL_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?sort=name'  + '&limit=50').then(function (workStatusResult) {
            var count = workStatusResult.body.length;
            expect(workStatusResult.response.statusCode).to.equal(200);
            expect(workStatusResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(workStatusResult.body).to.not.be.null;
            expect(workStatusResult.body).to.not.be.undefined;
            expect(workStatusResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(workStatusResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(workStatusResult.body[count - 1]).to.have.property('id');
            expect(workStatusResult.body[count - 1]).to.have.property('name');
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?name=" + testCaseData.input.name  + '&limit=50').then(function (workStatusResult) {
            expect(workStatusResult.response.statusCode).to.equal(200);
            expect(workStatusResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(workStatusResult.body).to.not.be.null;
            expect(workStatusResult.body).to.not.be.undefined;
            expect(workStatusResult.body).to.be.instanceof(Array);
          //  var count = workStatusResult.body.length;
            expect(workStatusResult.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < workStatusResult.body.length; i = i + 1) {
                expect(workStatusResult.body[i]).to.have.property('id');
                expect(workStatusResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(workStatusResult.body[i]).to.have.property('description');
            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?sort=" + testCaseData.input.sort + '&name=' + testCaseData.input.name  + '&limit=50').then(function (lookupEducationLevelResult) {
            expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
            expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(lookupEducationLevelResult.body).to.not.be.null;
            expect(lookupEducationLevelResult.body).to.not.be.undefined;
            expect(lookupEducationLevelResult.body).to.be.instanceof(Array);
           // var count = lookupEducationLevelResult.body.length;
            expect(lookupEducationLevelResult.body.length).to.equal(testCaseData.expected.count);
            expect(lookupEducationLevelResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(lookupEducationLevelResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(lookupEducationLevelResult.body[0]).to.have.property('description');
            for (i = 0; i < lookupEducationLevelResult.body.length; i = i + 1) {
                expect(lookupEducationLevelResult.body[i]).to.have.property('id');
                expect(lookupEducationLevelResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(lookupEducationLevelResult.body[i]).to.have.property('description');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id;
        this.timeout(15000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (workStatusResult) {
            expect(workStatusResult.response.statusCode).to.equal(200);
            expect(workStatusResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(workStatusResult.body).to.not.be.null;
            expect(workStatusResult.body).to.not.be.undefined;
            expect(workStatusResult.body).to.have.property('id', testCaseData.input.id);
            expect(workStatusResult.body).to.have.property('name', testCaseData.expected.name);
            expect(workStatusResult.body).to.have.property('description', testCaseData.expected.description);
        });
    });
    function execute(a) {
        it("TEST_FOR_BASIC_POST_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(20000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(201);
                    expect(workStatusResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(workStatusResult.body).to.have.property('id');
                    expect(workStatusResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(workStatusResult.body).to.have.property("description", testCaseData.input.payload.description);
                    testSuiteData.dynamicId = workStatusResult.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getRsult) {
                    expect(getRsult.response.statusCode).to.equal(200);
                    expect(getRsult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getRsult.body).to.have.property('id');
                    expect(getRsult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getRsult.body).to.have.property("description", testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(20000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "super") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(workStatusResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(workStatusResult.body).to.have.property('description', testCaseData.input.payload.description);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.body).to.have.property('description', testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "employee") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "candidate") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "newUser") {
                return response.then(function (workStatusResult) {
                    expect(workStatusResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (workStatusResult) {
                if (tokens[a].role === "super") {
                    expect(workStatusResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "employee") {
                    expect(workStatusResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "candidate") {
                    expect(workStatusResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "newUser") {
                    expect(workStatusResult.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
