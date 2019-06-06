var chakram = require('chakram'),
    token = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../../tests/config/config.json'),
    data = require('../../tests/data/data.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/entities",
    i,
    tokens = token.tokens;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
describe("COMMON_ENTITY", function () {
    var testSuite = this.title, dynamicId,
        testSuiteData = {};
    this.timeout(30000);
    it("TEST_FOR_BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5').then(function (commonEntityResult) {
            expect(commonEntityResult.response.statusCode).to.equal(200);
            expect(commonEntityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonEntityResult.body).to.not.be.null;
            expect(commonEntityResult.body).to.not.be.undefined;
            expect(commonEntityResult.body[0]).to.have.property('id', testCaseData.expected.id);
            expect(commonEntityResult.body[0]).to.have.property('name');
            expect(commonEntityResult.body[0]).to.have.property('description');
            expect(commonEntityResult.body[0]).to.have.property('lastmoddatetime');
            dynamicId = commonEntityResult.body[0].id;
            var d = new Date(commonEntityResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5&sort=name').then(function (commonEntityResult) {
            var count = commonEntityResult.body.length;
            expect(commonEntityResult.response.statusCode).to.equal(200);
            expect(commonEntityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonEntityResult.body).to.not.be.null;
            expect(commonEntityResult.body).to.not.be.undefined;
            expect(commonEntityResult.body[0]).to.have.property('id');
            expect(commonEntityResult.body[0]).to.have.property('name');
            expect(commonEntityResult.body[0]).to.have.property('description');
            expect(commonEntityResult.body[count - 1]).to.have.property('id');
            expect(commonEntityResult.body[count - 1]).to.have.property('name');
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (commonEntityResult) {
            expect(commonEntityResult.response.statusCode).to.equal(200);
            expect(commonEntityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonEntityResult.body).to.not.be.null;
            expect(commonEntityResult.body).to.not.be.undefined;
            expect(commonEntityResult.body).to.be.instanceof(Array);
            for (i = 0; i < commonEntityResult.body.length; i = i + 1) {
                expect(commonEntityResult.body[i]).to.have.property('id');
                expect(commonEntityResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(commonEntityResult.body[i]).to.have.property('description');
            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&sort=" + testCaseData.input.sort + '&name=' + testCaseData.input.filter).then(function (commonEntityResult) {
            expect(commonEntityResult.response.statusCode).to.equal(200);
            expect(commonEntityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonEntityResult.body).to.not.be.null;
            expect(commonEntityResult.body).to.not.be.undefined;
            expect(commonEntityResult.body).to.be.instanceof(Array);
            expect(commonEntityResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(commonEntityResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(commonEntityResult.body[0]).to.have.property('description');
            for (i = 0; i < commonEntityResult.body.length; i = i + 1) {
                expect(commonEntityResult.body[i]).to.have.property('id');
                expect(commonEntityResult.body[i]).to.have.property('name', testCaseData.input.filter);
                expect(commonEntityResult.body[i]).to.have.property('description');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId).then(function (commonEntityResult) {
            expect(commonEntityResult.response.statusCode).to.equal(200);
            expect(commonEntityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonEntityResult.body).to.not.be.null;
            expect(commonEntityResult.body).to.not.be.undefined;
            expect(commonEntityResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonEntityResult.body).to.have.property('name', testCaseData.expected.name);
            expect(commonEntityResult.body).to.have.property('description', testCaseData.expected.description);
        });
    });
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
    function execute(index) {
        it("TEST_FOR_BASIC_POST_ENTITY_BY_" + tokens[index].role, function () {
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
                    expect(postedData.body).to.have.property('description', testCaseData.input.payload.description);
                    testSuiteData.dynamicId = postedData.response.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getData.body).to.have.property('description', testCaseData.input.payload.description);
                });
            } else if (tokens[index].role === "EMPLOYEE") {
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
        it("TEST_FOR_BASIC_PUT_ENTITY_BY_" + tokens[index].role, function () {
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
                    expect(postedData.body).to.have.property('description', testCaseData.input.payload.description);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getData.body).to.have.property('description', testCaseData.input.payload.description);
                });
            } else if (tokens[index].role === "EMPLOYEE") {
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
        it("TEST_FOR_BASIC_DELETE_ENTITY_FOR_" + tokens[index].role, function () {
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

