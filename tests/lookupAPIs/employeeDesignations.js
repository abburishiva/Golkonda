/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    data = require('../data/data.json'),
    url = baseUrl + "lookup/designations",
    i,
    Id,
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOOKUP_EMPLOYEE_DESIGNATIONS", function () {
    var testSuite = this.title;
    it("BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url).then(function (designationResultData) {
            expect(designationResultData.response.statusCode).to.equal(400);
            expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(designationResultData.body).to.not.be.null;
            expect(designationResultData.body).to.not.be.undefined;
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?limit=5&sort=name').then(function (designationResultData) {
            var count = designationResultData.body.length;
            expect(designationResultData.response.statusCode).to.equal(200);
            expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(designationResultData.body).to.not.be.null;
            expect(designationResultData.body).to.not.be.undefined;
            expect(designationResultData.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(designationResultData.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(designationResultData.body[0]).to.have.property('flag');
            expect(designationResultData.body[count - 1]).to.have.property('id');
            expect(designationResultData.body[count - 1]).to.have.property('name');
        });
    });
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (designationResultData) {
            expect(designationResultData.response.statusCode).to.equal(200);
            expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(designationResultData.body).to.not.be.null;
            expect(designationResultData.body).to.not.be.undefined;
            expect(designationResultData.body).to.be.instanceof(Array);
            expect(designationResultData.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < designationResultData.body.length; i = i + 1) {
                expect(designationResultData.body[i]).to.have.property('id');
                expect(designationResultData.body[i]).to.have.property('name');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?limit=5&sort=" + testCaseData.input.sort + '&name=' + testCaseData.input.name).then(function (designationResultData) {
            expect(designationResultData.response.statusCode).to.equal(200);
            expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(designationResultData.body).to.not.be.null;
            expect(designationResultData.body).to.not.be.undefined;
            expect(designationResultData.body).to.be.instanceof(Array);
            expect(designationResultData.body.length).to.equal(testCaseData.expected.count);
            expect(designationResultData.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(designationResultData.body[0]).to.have.property('name', testCaseData.expected.first.name);
            for (i = 0; i < designationResultData.body.length; i = i + 1) {
                expect(designationResultData.body[i]).to.have.property('id');
                expect(designationResultData.body[i]).to.have.property('name', testCaseData.expected.first.name);
            }
        });
    });
    it("GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id;
        this.timeout(15000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + id + '?').then(function (designationResultData) {
            expect(designationResultData.response.statusCode).to.equal(200);
            expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(designationResultData.body).to.not.be.null;
            expect(designationResultData.body).to.not.be.undefined;
            expect(designationResultData.body).to.have.property('id', testCaseData.input.id);
            expect(designationResultData.body).to.have.property('name', testCaseData.expected.name);
            expect(designationResultData.body).to.have.property('flag');
        });
    });
    function execute(a) {
        it("BASIC_POST_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(20000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(201);
                    expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(designationResultData.body).to.have.property('id');
                    expect(designationResultData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(designationResultData.body).to.have.property("flag", testCaseData.input.payload.flag);
                    expect(designationResultData.body).to.have.property("description", testCaseData.input.payload.description);
                    Id = designationResultData.body.id;
                    return chakram.get(url + '/' + Id);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.have.property('id');
                    expect(getResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.body).to.have.property("flag", testCaseData.input.payload.flag);
                    expect(getResult.body).to.have.property("description", testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(401);
                });
            }
        });
        it("BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(20000);
            response = chakram.put(url + '/' + Id, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(designationResultData.response.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(designationResultData.response.body).to.have.property("flag", testCaseData.input.payload.flag);
                    expect(designationResultData.response.body).to.have.property("description", testCaseData.input.payload.description);
                    return chakram.get(url + '/' + Id);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.response.body).to.have.property('id');
                    expect(getResult.response.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.response.body).to.have.property("flag", testCaseData.input.payload.flag);
                    expect(getResult.response.body).to.have.property("description", testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (designationResultData) {
                    expect(designationResultData.response.statusCode).to.equal(401);
                });
            }
        });
        it("BASIC_DELETE_" + tokens[a].role, function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + Id, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (designationResultData) {
                if (tokens[a].role === "super") {
                    expect(designationResultData.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + Id, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "employee") {
                    expect(designationResultData.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "candidate") {
                    expect(designationResultData.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "newUser") {
                    expect(designationResultData.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
