/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    url = baseUrl + "lookup/cities",
    data = require('../data/data.json'),
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOOKUP_CITY", function () {
    var testSuite = this.title, testSuiteData = {};
    it("BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=50').then(function (cityResult) {
            expect(cityResult.response.statusCode).to.equal(200);
            expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(cityResult.body).to.not.be.null;
            expect(cityResult.body).to.not.be.undefined;
            expect(cityResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(cityResult.body[0]).to.have.property('id');
            expect(cityResult.body[0]).to.have.property('name');
            expect(cityResult.body[0]).to.have.property('latitude');
            expect(cityResult.body[0]).to.have.property('longitude');
            expect(cityResult.body[0]).to.have.property('region');
            expect(cityResult.body[0]).to.have.property('zipcode');
            var d = new Date(cityResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?sort=name' + '&limit=50').then(function (cityResult) {
            var count = cityResult.body.length;
            expect(cityResult.response.statusCode).to.equal(200);
            expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(cityResult.body).to.not.be.null;
            expect(cityResult.body).to.not.be.undefined;
            expect(cityResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(cityResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(cityResult.body[0]).to.have.property('latitude');
            expect(cityResult.body[count - 1]).to.have.property('id');
            expect(cityResult.body[count - 1]).to.have.property('name');
        });
    });
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?name=" + testCaseData.input.name+ '&limit=50').then(function (cityResult) {
            expect(cityResult.response.statusCode).to.equal(200);
            expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(cityResult.body).to.not.be.null;
            expect(cityResult.body).to.not.be.undefined;
            expect(cityResult.body).to.be.instanceof(Array);
            expect(cityResult.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < cityResult.body.length; i = i + 1) {
                expect(cityResult.body[i]).to.have.property('id');
                expect(cityResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(cityResult.body[i]).to.have.property('latitude');
                expect(cityResult.body[i]).to.have.property('longitude');
            }
        });
    });
    it("GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id = testCaseData.input.id;
        this.timeout(30000);
        return chakram.get(url + '/' + id).then(function (cityResult) {
            expect(cityResult.response.statusCode).to.equal(200);
            expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(cityResult.body).to.not.be.null;
            expect(cityResult.body).to.not.be.undefined;
            expect(cityResult.body).to.have.property('id', testCaseData.input.id);
            expect(cityResult.body).to.have.property('name', testCaseData.expected.name);
            expect(cityResult.body).to.have.property('latitude', testCaseData.expected.latitude);
            expect(cityResult.body).to.have.property('longitude', testCaseData.expected.longitude);
        });
    });
    function execute(a) {
        it("TEST_FOR_BASIC_POST_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(201);
                    expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(cityResult.body).to.have.property('id');
                    expect(cityResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(cityResult.body).to.have.property("latitude", testCaseData.input.payload.latitude);
                    expect(cityResult.body).to.have.property('longitude', testCaseData.input.payload.longitude);
                    testSuiteData.dynamicId = cityResult.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getRsult) {
                    expect(getRsult.response.statusCode).to.equal(200);
                    expect(getRsult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getRsult.body).to.have.property('id');
                    expect(getRsult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getRsult.body).to.have.property("latitude", testCaseData.input.payload.latitude);
                    expect(getRsult.body).to.have.property('longitude', testCaseData.input.payload.longitude);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(cityResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(cityResult.body).to.have.property('latitude', testCaseData.input.payload.latitude);
                    expect(cityResult.body).to.have.property('longitude', testCaseData.input.payload.longitude);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.body).to.have.property('latitude', testCaseData.input.payload.latitude);
                    expect(getResult.body).to.have.property('longitude', testCaseData.input.payload.longitude);
                });
            }  else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(403);
                });
            } else if(tokens[a].role === "NEW_USER") {
                return response.then(function (cityResult) {
                    expect(cityResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (cityResult) {
                if (tokens[a].role === "SUPER") {
                    expect(cityResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(cityResult.response.statusCode).to.equal(403);
                }else if (tokens[a].role === "CANDIDATE") {
                    expect(cityResult.response.statusCode).to.equal(403);
                }else if (tokens[a].role === "NEW_USER") {
                    expect(cityResult.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});

