var chakram = require('chakram'),
    token = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../config/config.json'),
    data = require('../data/data.json'),
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
});