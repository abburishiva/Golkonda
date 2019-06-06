/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    Id,
    data = require('../data/data.json'),
    url = baseUrl + "lookup/education/levels",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOOKUP_EDUCATION_LEVEL", function () {
    var testSuite = this.title;
    it("BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?limit=50').then(function (lookupEducationLevelResult) {
            expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
            expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(lookupEducationLevelResult.body).to.not.be.null;
            expect(lookupEducationLevelResult.body).to.not.be.undefined;
            expect(lookupEducationLevelResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(lookupEducationLevelResult.body[0]).to.have.property('id');
            expect(lookupEducationLevelResult.body[0]).to.have.property('name');
            expect(lookupEducationLevelResult.body[0]).to.have.property('description');
            expect(lookupEducationLevelResult.body[0]).to.have.property('lastmoddatetime');
            var d = new Date(lookupEducationLevelResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
  /*  it("GET_ALL_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?sort=name').then(function (lookupEducationLevelResult) {
            expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
            var count = lookupEducationLevelResult.body.length;
            expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(lookupEducationLevelResult.body).to.not.be.null;
            expect(lookupEducationLevelResult.body).to.not.be.undefined;
            expect(lookupEducationLevelResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(lookupEducationLevelResult.body[0]).to.have.property("description");
            expect(lookupEducationLevelResult.body[count - 1]).to.have.property('id');
            expect(lookupEducationLevelResult.body[count - 1]).to.have.property('name');
        });
    });*/
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?name=" + testCaseData.input.name  + '&limit=50').then(function (lookupEducationLevelResult) {
            expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
            expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(lookupEducationLevelResult.body).to.not.be.null;
            expect(lookupEducationLevelResult.body).to.not.be.undefined;
            expect(lookupEducationLevelResult.body).to.be.instanceof(Array);
            expect(lookupEducationLevelResult.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < lookupEducationLevelResult.body.length; i = i + 1) {
                expect(lookupEducationLevelResult.body[i]).to.have.property('id');
                expect(lookupEducationLevelResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(lookupEducationLevelResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?sort=" + testCaseData.input.sort + '&name=' + testCaseData.input.name + '&limit=50').then(function (lookupEducationLevelResult) {
            expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
            expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(lookupEducationLevelResult.body).to.not.be.null;
            expect(lookupEducationLevelResult.body).to.not.be.undefined;
            expect(lookupEducationLevelResult.body).to.be.instanceof(Array);
          //  var count = lookupEducationLevelResult.body.length;
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
    it("GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id;
        this.timeout(15000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (lookupEducationLevelResult) {
            expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
            expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(lookupEducationLevelResult.body).to.not.be.null;
            expect(lookupEducationLevelResult.body).to.not.be.undefined;
            expect(lookupEducationLevelResult.body).to.have.property('id', testCaseData.input.id);
            expect(lookupEducationLevelResult.body).to.have.property('name', testCaseData.expected.name);
            expect(lookupEducationLevelResult.body).to.have.property('description', testCaseData.expected.description);
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
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(201);
                    expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(lookupEducationLevelResult.body).to.have.property('id');
                    expect(lookupEducationLevelResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(lookupEducationLevelResult.body).to.have.property('description', testCaseData.input.payload.description);
                    Id = lookupEducationLevelResult.body.id;
                    return chakram.get(url + '/' + Id);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', Id);
                    expect(getResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.body).to.have.property('description', testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "NEW_USER") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(20000);
            response =  chakram.put(url + '/' + Id, testCaseData.input.payload, {
                headers: {'x-access-token':  tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(200);
                    expect(lookupEducationLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(lookupEducationLevelResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(lookupEducationLevelResult.body).to.have.property('description', testCaseData.input.payload.description);
                    return chakram.get(url + '/' + Id);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', Id);
                    expect(getResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.body).to.have.property('description', testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "NEW_USER") {
                return response.then(function (lookupEducationLevelResult) {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + Id, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (lookupEducationLevelResult) {
                if (tokens[a].role === "SUPER") {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + Id, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(lookupEducationLevelResult.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});


