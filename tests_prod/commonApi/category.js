/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    expect = chakram.expect,
    data = require('../data/data.json'),
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
});