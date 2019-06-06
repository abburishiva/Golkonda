/*
/!* jshint *!/
/!*global process,describe,it,i,execute*!/
var chakram = require('chakram'),
    tokens = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../config/config.json'),
    data = require('../data/data.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/addresses",
    limit = "?limit=50",
    i,
    dynamicId,
    tokens = tokens.tokens;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
describe("COMMON_ADDRESS", function () {
    var testSuite = this.title,
        testSuiteData = {};
    this.timeout(30000);
    it("BASIC_GET_ALL", function () {
        return chakram.get(url + limit).then(function (commonAddressResult) {
            expect(commonAddressResult.response.statusCode).to.equal(200);
            expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonAddressResult.body).to.not.be.null;
            expect(commonAddressResult.body).to.not.be.undefined;
            expect(commonAddressResult.body[0]).to.have.property('id');
            expect(commonAddressResult.body[0]).to.have.property('address1');
            expect(commonAddressResult.body[0]).to.have.property('address2');
            expect(commonAddressResult.body[0]).to.have.property('cityid');
            expect(commonAddressResult.body[0]).to.have.property('usercity');
            expect(commonAddressResult.body[0]).to.have.property('region');
            expect(commonAddressResult.body[0]).to.have.property('countryid');
            var d = new Date(commonAddressResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + limit + '&sort=address1').then(function (commonAddressResult) {
            var count = commonAddressResult.body.length;
            expect(commonAddressResult.response.statusCode).to.equal(200);
            expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonAddressResult.body).to.not.be.null;
            expect(commonAddressResult.body).to.not.be.undefined;
            expect(commonAddressResult.body[0]).to.have.property('id', testCaseData.expected.id);
            expect(commonAddressResult.body[0]).to.have.property('address1');
            expect(commonAddressResult.body[0]).to.have.property('address2', testCaseData.expected.address2);
            expect(commonAddressResult.body[0]).to.have.property('cityid');
            expect(commonAddressResult.body[0]).to.have.property('usercity');
            expect(commonAddressResult.body[0]).to.have.property('region');
            expect(commonAddressResult.body[0]).to.have.property('countryid');
            expect(commonAddressResult.body[count - 1]).to.have.property('id');
            expect(commonAddressResult.body[count - 1]).to.have.property('address1');
        });
    });
    it("GET_ALL_FILTERING_BY_REGION", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase], i;
        this.timeout(30000);
        return chakram.get(url + limit + "&region=" + testCaseData.input.region).then(function (commonAddressResult) {
            expect(commonAddressResult.response.statusCode).to.equal(200);
            expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonAddressResult.body).to.not.be.null;
            expect(commonAddressResult.body).to.not.be.undefined;
            expect(commonAddressResult.body).to.be.instanceof(Array);
            for (i = 0; i < commonAddressResult.body.length; i = i + 1) {
                expect(commonAddressResult.body[i]).to.have.property('id');
                expect(commonAddressResult.body[i]).to.have.property('region', testCaseData.input.region);
                expect(commonAddressResult.body[i]).to.have.property('address1');
                expect(commonAddressResult.body[i]).to.have.property('address2');
                expect(commonAddressResult.body[i]).to.have.property('cityid');
                expect(commonAddressResult.body[i]).to.have.property('usercity');
                expect(commonAddressResult.body[i]).to.have.property('region');
                expect(commonAddressResult.body[i]).to.have.property('countryid');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase], i;
        this.timeout(30000);
        return chakram.get(url + limit + '&type=all' + "&sort=" + testCaseData.input.sort + '&countryid=' + testCaseData.input.countryid).then(function (commonAddressResult) {
            expect(commonAddressResult.response.statusCode).to.equal(200);
            expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonAddressResult.body).to.not.be.null;
            expect(commonAddressResult.body).to.not.be.undefined;
            expect(commonAddressResult.body).to.be.instanceof(Array);
            var count = commonAddressResult.body.length;
            expect(commonAddressResult.body[0]).to.have.property('id');
            expect(commonAddressResult.body[0]).to.have.property('address1');
            expect(commonAddressResult.body[0]).to.have.property('address2');
            expect(commonAddressResult.body[0]).to.have.property('lookup_city').to.be.an('object');
            expect(commonAddressResult.body[0].lookup_city).to.have.property('id', testCaseData.expected.id);
            expect(commonAddressResult.body[0].lookup_city).to.have.property('name', testCaseData.expected.name);
            expect(commonAddressResult.body[0].lookup_city).to.have.property('latitude', testCaseData.expected.latitude);
            expect(commonAddressResult.body[0].lookup_city).to.have.property('longitude', testCaseData.expected.longitude);
            expect(commonAddressResult.body[0].lookup_city).to.have.property('region', testCaseData.expected.region);
            expect(commonAddressResult.body[count - 1]).to.have.property('id');
            expect(commonAddressResult.body[count - 1]).to.have.property('address1');
            for (i = 0;i < commonAddressResult.body.length;i = i + 1) {
                expect(commonAddressResult.body[i]).to.have.property('id');
                expect(commonAddressResult.body[i]).to.have.property('address1');
                expect(commonAddressResult.body[i]).to.have.property('address2');
                expect(commonAddressResult.body[i]).to.have.property('lookup_city').to.be.an('object');
                expect(commonAddressResult.body[i].lookup_city).to.have.property('name');
                expect(commonAddressResult.body[i].lookup_city).to.have.property('latitude');
            }
        });
    });
    it("GET_ONE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase],
            id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (commonAddressResult) {
            expect(commonAddressResult.response.statusCode).to.equal(200);
            expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonAddressResult.body).to.not.be.null;
            expect(commonAddressResult.body).to.not.be.undefined;
            expect(commonAddressResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonAddressResult.body).to.have.property('address1', testCaseData.expected.address1);
            expect(commonAddressResult.body).to.have.property('address2', testCaseData.expected.address2);
            expect(commonAddressResult.body).to.have.property('cityid', testCaseData.expected.cityid);
            expect(commonAddressResult.body).to.have.property('usercity', testCaseData.expected.usercity);
            expect(commonAddressResult.body).to.have.property('region', testCaseData.expected.region);
            expect(commonAddressResult.body).to.have.property('countryid', testCaseData.expected.countryid);
        });
    });
    it("GET_ONE_TYPE_ALL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase],
            id = testCaseData.input.id, i;
        return chakram.get(url + '/' + id + limit + '&type=all').then(function (commonAddressResult) {
            expect(commonAddressResult.response.statusCode).to.equal(200);
            expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonAddressResult.body).to.not.be.null;
            expect(commonAddressResult.body).to.not.be.undefined;
            expect(commonAddressResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonAddressResult.body).to.have.property('lookup_city').to.be.an('object');
            expect(commonAddressResult.body.lookup_city).to.have.property('id', testCaseData.expected.lookup_city.id);
            expect(commonAddressResult.body.lookup_city).to.have.property('name', testCaseData.expected.lookup_city.name);
            expect(commonAddressResult.body.lookup_city).to.have.property('latitude', testCaseData.expected.lookup_city.latitude);
            expect(commonAddressResult.body.lookup_city).to.have.property('region', testCaseData.expected.lookup_city.region);
            expect(commonAddressResult.body.lookup_city).to.have.property('longitude', testCaseData.expected.lookup_city.longitude);
        });
    });
    function execute(a) {
        it("BASIC_POST_" + tokens[a].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
                });
            if (tokens[a].role === "SUPER") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(201);
                    expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(commonAddressResult.body).to.have.property('id');
                    expect(commonAddressResult.body).to.have.property('address1', testCaseData.input.payload.address1);
                    expect(commonAddressResult.body).to.have.property('cityid', testCaseData.input.payload.cityid);
                    expect(commonAddressResult.body).to.have.property('countryid', testCaseData.input.payload.countryid);
                    dynamicId = commonAddressResult.body.id;
                    return chakram.get(url + '/' + dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', dynamicId);
                    expect(getResult.body).to.have.property('address1', testCaseData.input.payload.address1);
                    expect(getResult.body).to.have.property('cityid', testCaseData.input.payload.cityid);

                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase],
                response = chakram.put(url + '/' + dynamicId, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
            if (tokens[a].role === "SUPER") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(200);
                    expect(commonAddressResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(commonAddressResult.body).to.have.property('address1', testCaseData.input.payload.address1);
                    expect(commonAddressResult.body).to.have.property('cityid', testCaseData.input.payload.cityid);
                    expect(commonAddressResult.body).to.have.property('countryid', testCaseData.input.payload.countryid);
                    return chakram.get(url + '/' + dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', dynamicId);
                    expect(getResult.body).to.have.property('address1', testCaseData.input.payload.address1);
                    expect(getResult.body).to.have.property('cityid', testCaseData.input.payload.cityid);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (commonAddressResult) {
                    expect(commonAddressResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("BASIC_DELETE_" + tokens[a].role, function () {
            return chakram.delete(url + '/' + dynamicId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + dynamicId, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
    }
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});

*/

