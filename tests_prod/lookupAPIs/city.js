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
        return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (cityResult) {
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
});