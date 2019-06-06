/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    expect = chakram.expect,
    data = require('../../tests/data/data.json'),
    url = baseUrl + "common/categories",
    i,
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("COMMON_CATEGORY", function () {
    var testSuite = this.title,
        testSuiteData = {};
    this.timeout(30000);
    it("BASIC_GET_ALL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5').then(function (commonCategoryResult) {
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body.length).to.be.above(testCaseData.expected.count);
            expect(commonCategoryResult.body[0]).to.have.property('id');
            expect(commonCategoryResult.body[0]).to.have.property('entityid');
            expect(commonCategoryResult.body[0]).to.have.property('name');
            expect(commonCategoryResult.body[0]).to.have.property('description');
            expect(commonCategoryResult.body[0]).to.have.property('enabled');
            expect(commonCategoryResult.body[0]).to.have.property('lastmoddatetime');
            var d = new Date(commonCategoryResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5&sort=name').then(function (commonCategoryResult) {
            var count = commonCategoryResult.body.length;
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body[0]).to.have.property('id');
            expect(commonCategoryResult.body[0]).to.have.property('entityid');
            expect(commonCategoryResult.body[0]).to.have.property('name');
            expect(commonCategoryResult.body[0]).to.have.property('description');
        });
    });
    it("GET_ALL_FILTERING_BY_ENTITY", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&entityid=" + testCaseData.input.entityid).then(function (commonCategoryResult) {
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body).to.be.instanceof(Array);
            for (i = 0; i < commonCategoryResult.body.length; i = i + 1) {
                expect(commonCategoryResult.body[i]).to.have.property('id');
                expect(commonCategoryResult.body[i]).to.have.property('entityid', testCaseData.input.entityid);
                expect(commonCategoryResult.body[i]).to.have.property('name');
                expect(commonCategoryResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], i;
        this.timeout(30000);
        return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (commonCategoryResult) {
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body).to.be.instanceof(Array);
            expect(commonCategoryResult.body.length).to.be.equal(testCaseData.expected.count);
            for (i = 0; i < commonCategoryResult.body.length; i = i + 1) {
                expect(commonCategoryResult.body[i]).to.have.property('id');
                expect(commonCategoryResult.body[i]).to.have.property('entityid');
                expect(commonCategoryResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(commonCategoryResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], i;
        this.timeout(30000);
        return chakram.get(url + "?limit=5&sort=" + testCaseData.input.sort + '&entityid=' + testCaseData.input.entityid).then(function (commonCategoryResult) {
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body).to.be.instanceof(Array);
            var count = commonCategoryResult.body.length;
            expect(commonCategoryResult.body.length).to.be.greaterThan(testCaseData.expected.count);
            expect(commonCategoryResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(commonCategoryResult.body[0]).to.have.property('entityid');
            expect(commonCategoryResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(commonCategoryResult.body[0]).to.have.property('description');
            expect(commonCategoryResult.body[count - 1]).to.have.property('id');
            expect(commonCategoryResult.body[count - 1]).to.have.property('name');
            for (i = 0; i < commonCategoryResult.body.length; i = i + 1) {
                expect(commonCategoryResult.body[i]).to.have.property('id');
                expect(commonCategoryResult.body[i]).to.have.property('entityid', testCaseData.input.entityid);
                expect(commonCategoryResult.body[i]).to.have.property('name');
                expect(commonCategoryResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ONE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase],
            id = testCaseData.input.id;
        this.timeout(30000);
        return chakram.get(url + '/' + id).then(function (commonCategoryResult) {
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonCategoryResult.body).to.have.property('enabled', testCaseData.expected.enabled);
            expect(commonCategoryResult.body).to.have.property('name', testCaseData.expected.name);
            // expect(commonCategoryResult.body).to.have.property('display_name', testCaseData.expected.display_name);
            expect(commonCategoryResult.body).to.have.property('description', testCaseData.expected.description);
        });
    });
    it("GET_ONE_TYPE_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], i;
        id = testCaseData.input.id;
        this.timeout(30000);
        return chakram.get(url + '/' + id + '?type=all').then(function (commonCategoryResult) {
            expect(commonCategoryResult.response.statusCode).to.equal(200);
            expect(commonCategoryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonCategoryResult.body).to.not.be.null;
            expect(commonCategoryResult.body).to.not.be.undefined;
            expect(commonCategoryResult.body).to.have.property('name', testCaseData.expected.name);
            expect(commonCategoryResult.body).to.have.property('common_entity').to.be.an('object');
        });
    });
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
    function execute(index) {
        it("BASIC_POST_" + tokens[index].role, function () {
            this.timeout(30000);
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase],
                response = chakram.post(url, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[index].token},
                    json: true
                });
            if (tokens[index].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(201);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(postedData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(postedData.body).to.have.property('display_name', testCaseData.input.payload.display_name);
                    expect(postedData.body).to.have.property('description', testCaseData.input.payload.description);
                    testSuiteData.dynamicId = postedData.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getData.body).to.have.property('display_name', testCaseData.input.payload.display_name);
                    expect(getData.body).to.have.property('description', testCaseData.input.payload.description);
                });
            }
            else if (tokens[index].role === "EMPLOYEE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            } else if (tokens[index].role === "CANDIDATE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            } else if (tokens[index].role === "NEW_USER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(401);
                });
            }
        });
        it("BASIC_PUT_" + tokens[index].role, function () {
            this.timeout(30000);
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase],
                response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[index].token},
                    json: true
                });
            if (tokens[index].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(200);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(postedData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(postedData.body).to.have.property('display_name', testCaseData.input.payload.display_name);
                    expect(postedData.body).to.have.property('description', testCaseData.input.payload.description);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getData.body).to.have.property('display_name', testCaseData.input.payload.display_name);
                    expect(getData.body).to.have.property('description', testCaseData.input.payload.description);
                });
            }
            else if (tokens[index].role === "EMPLOYEE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[index].role === "CANDIDATE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[index].role === "NEW_USER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(401);
                });
            }
        });

        it("BASIC_DELETE_" + tokens[index].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[index].token},
                json: false
            }).then(function (Result) {
                if (tokens[index].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[index].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[index].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[index].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[index].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }
            });
        });
    }
});