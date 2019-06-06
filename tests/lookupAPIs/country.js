/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    Id,
    data = require('../data/data.json'),
    url = baseUrl + "lookup/countries",
    i,
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOOKUP_COUNTRY", function () {
    var testSuite = this.title;
    it("TEST_FOR_BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(20000);
        return chakram.get(url + '?limit=50').then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            if (countryResult.body.length > 0) {
                expect(countryResult.body[0]).to.have.property('id');
                expect(countryResult.body[0]).to.have.property('iso2');
                expect(countryResult.body[0]).to.have.property('short_name');
                expect(countryResult.body[0]).to.have.property('long_name');
                expect(countryResult.body[0]).to.have.property('iso3');
                expect(countryResult.body[0]).to.have.property('numcode');
                expect(countryResult.body[0]).to.have.property('un_member');
                var d = new Date(countryResult.body[0].lastmoddatetime);
                expect(d.constructor.name).to.equal('Date');
            }
        });
    });
    it("TEST_FOR_GET_ALL_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?sort=short_name&limit=50').then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            var count = countryResult.body.length;
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            expect(countryResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(countryResult.body[0]).to.have.property('iso2', testCaseData.expected.first.iso2);
            expect(countryResult.body[0]).to.have.property('short_name', testCaseData.expected.first.short_name);
            expect(countryResult.body[count - 1]).to.have.property('id');
            expect(countryResult.body[count - 1]).to.have.property('short_name');
        });
    });
   /* it("TEST_FOR_GET_ALL_FILTERING_BY_SHORT_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?short_name=" + testCaseData.input.short_name).then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            expect(countryResult.body).to.be.instanceof(Array);
            for (i = 0; i < countryResult.body.length; i = i + 1) {
                expect(countryResult.body[i]).to.have.property('id');
                expect(countryResult.body[i]).to.have.property('iso2');
                expect(countryResult.body[i]).to.have.property('short_name', testCaseData.input.short_name);
                expect(countryResult.body[i]).to.have.property('long_name');
                expect(countryResult.body[i]).to.have.property('iso3');
            }
        });
    });*/
    it("TEST_FOR_GET_ALL_FILTERING_BY_ISO2", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?iso2=" + testCaseData.input.iso2 + '&limit=50').then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            expect(countryResult.body).to.be.instanceof(Array);
            expect(countryResult.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < countryResult.body.length; i = i + 1) {
                expect(countryResult.body[i]).to.have.property('id');
                expect(countryResult.body[i]).to.have.property('iso2');
                expect(countryResult.body[i]).to.have.property('short_name');
                expect(countryResult.body[i]).to.have.property('long_name');
                expect(countryResult.body[i]).to.have.property('iso3');
            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_ISO3", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?iso3=" + testCaseData.input.iso3  + '&limit=50').then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            expect(countryResult.body).to.be.instanceof(Array);
            expect(countryResult.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < countryResult.body.length; i = i + 1) {
                expect(countryResult.body[i]).to.have.property('id');
                expect(countryResult.body[i]).to.have.property('iso2');
                expect(countryResult.body[i]).to.have.property('short_name');
                expect(countryResult.body[i]).to.have.property('long_name');
                expect(countryResult.body[i]).to.have.property('iso3');
            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?sort=" + testCaseData.input.sort + '&short_name=' + testCaseData.input.short_name + '&limit=50').then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            expect(countryResult.body).to.be.instanceof(Array);
            expect(countryResult.body.length).to.above(testCaseData.expected.count);
            for (i = 0; i < countryResult.body.length; i = i + 1) {
                expect(countryResult.body[i]).to.have.property('id');
                expect(countryResult.body[i]).to.have.property('iso2');
                expect(countryResult.body[i]).to.have.property('short_name');
                expect(countryResult.body[i]).to.have.property('long_name');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id;
        this.timeout(15000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (countryResult) {
            expect(countryResult.response.statusCode).to.equal(200);
            expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(countryResult.body).to.not.be.null;
            expect(countryResult.body).to.not.be.undefined;
            expect(countryResult.body).to.have.property('id', testCaseData.input.id);
            expect(countryResult.body).to.have.property('iso2', testCaseData.expected.iso2);
            expect(countryResult.body).to.have.property('short_name', testCaseData.expected.short_name);
            expect(countryResult.body).to.have.property('long_name', testCaseData.expected.long_name);
            expect(countryResult.body).to.have.property('iso3', testCaseData.expected.iso3);
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
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(201);
                    expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(countryResult.body).to.have.property('id');
                    expect(countryResult.body).to.have.property('iso2', testCaseData.input.payload.iso2);
                    expect(countryResult.body).to.have.property("short_name", testCaseData.input.payload.short_name);
                    expect(countryResult.body).to.have.property('long_name', testCaseData.input.payload.long_name);
                    Id = countryResult.body.id;
                    return chakram.get(url + '/' + Id);
                }).then(function (getRsult) {
                    expect(getRsult.response.statusCode).to.equal(200);
                    expect(getRsult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getRsult.body).to.have.property('id');
                    expect(getRsult.body).to.have.property('iso2', testCaseData.input.payload.iso2);
                    expect(getRsult.body).to.have.property("short_name", testCaseData.input.payload.short_name);
                    expect(getRsult.body).to.have.property('long_name', testCaseData.input.payload.long_name);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "NEW_USER") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase], response;
            this.timeout(40000);
            response = chakram.put(url + '/' + Id, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(countryResult.body).to.have.property('iso2', testCaseData.input.payload.iso2);
                    expect(countryResult.body).to.have.property('long_name', testCaseData.input.payload.long_name);
                    expect(countryResult.body).to.have.property('iso3', testCaseData.input.payload.iso3);
                    return chakram.get(url + '/' + Id);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', Id);
                    expect(getResult.body).to.have.property('iso2', testCaseData.input.payload.iso2);
                    expect(getResult.body).to.have.property('iso3', testCaseData.input.payload.iso3);
                    expect(getResult.body).to.have.property('short_name', testCaseData.input.payload.short_name);
                    expect(getResult.body).to.have.property('long_name', testCaseData.input.payload.long_name);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(403);
                });
            }else if (tokens[a].role === "NEW_USER") {
                return response.then(function (countryResult) {
                    expect(countryResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + Id, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (countryResult) {
                if (tokens[a].role === "SUPER") {
                    expect(countryResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + Id, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(countryResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(countryResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(countryResult.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});



