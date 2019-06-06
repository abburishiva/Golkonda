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
        return chakram.get(url + '?limit=5').then(function (countryResult) {
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
        return chakram.get(url + '?limit=5&sort=short_name').then(function (countryResult) {
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
    it("TEST_FOR_GET_ALL_FILTERING_BY_SHORT_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?limit=5&short_name=" + testCaseData.input.short_name).then(function (countryResult) {
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
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_ISO2", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?limit=5&iso2=" + testCaseData.input.iso2).then(function (countryResult) {
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
        return chakram.get(url + "?limit=5&iso3=" + testCaseData.input.iso3).then(function (countryResult) {
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
        return chakram.get(url + "?limit=5&sort=" + testCaseData.input.sort + '&name=' + testCaseData.input.short_name).then(function (countryResult) {
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
});