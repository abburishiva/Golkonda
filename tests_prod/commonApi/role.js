var chakram = require('chakram'),
    token = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../config/config.json'),
    data = require('../data/data.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/roles",
    i,
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("COMMON_ROLE", function () {
    var testSuite = this.title, dynamicId, testSuiteData = {};
    it("TEST_FOR_BASIC_GET_ALL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5').then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            dynamicId = commonLevelResult.body[0].id;
            expect(commonLevelResult.body[0]).to.have.property('id');
            expect(commonLevelResult.body[0]).to.have.property('entityid');
            expect(commonLevelResult.body[0]).to.have.property('name');
            expect(commonLevelResult.body[0]).to.have.property('description');
            expect(commonLevelResult.body[0]).to.have.property('lastmoddatetime');
            var d = new Date(commonLevelResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5&sort=name').then(function (commonLevelResult) {
            var count = commonLevelResult.body.length;
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body[0]).to.have.property('id');
            expect(commonLevelResult.body[0]).to.have.property('entityid');
            expect(commonLevelResult.body[0]).to.have.property('name');
            expect(commonLevelResult.body[0]).to.have.property('description');
            expect(commonLevelResult.body[count - 1]).to.have.property('id');
            expect(commonLevelResult.body[count - 1]).to.have.property('name');
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_ENTITY", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&entityid=" + testCaseData.input.entityid).then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            for (i = 0; i < commonLevelResult.body.length; i = i + 1) {
                expect(commonLevelResult.body[i]).to.have.property('id');
                expect(commonLevelResult.body[i]).to.have.property('entityid', testCaseData.input.entityid);
                expect(commonLevelResult.body[i]).to.have.property('name');
                expect(commonLevelResult.body[i]).to.have.property('description');

            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            expect(commonLevelResult.body.length).to.be.above(testCaseData.expected.count);
            for (i = 0; i < commonLevelResult.body.length; i = i + 1) {
                expect(commonLevelResult.body[i]).to.have.property('id');
                expect(commonLevelResult.body[i]).to.have.property('entityid');
                expect(commonLevelResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(commonLevelResult.body[i]).to.have.property('description');
            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&sort=" + testCaseData.input.sort + '&entityid=' + testCaseData.input.entityid).then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            expect(commonLevelResult.body[0]).to.have.property('id');
            expect(commonLevelResult.body[0]).to.have.property('entityid');
            expect(commonLevelResult.body[0]).to.have.property('name');
            expect(commonLevelResult.body[0]).to.have.property('description');
            for (i = 0; i < commonLevelResult.body.length; i = i + 1) {
                expect(commonLevelResult.body[i]).to.have.property('id');
                expect(commonLevelResult.body[i]).to.have.property('entityid', testCaseData.input.entityid);
                expect(commonLevelResult.body[i]).to.have.property('name');
                expect(commonLevelResult.body[i]).to.have.property('description');
            }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId).then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.have.property('id', dynamicId);
            expect(commonLevelResult.body).to.have.property('entityid');
            expect(commonLevelResult.body).to.have.property('name');
            expect(commonLevelResult.body).to.have.property('description');
        });
    });
    it("TEST_FOR_GET_ONE_TYPE_ALL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId + '?type=all').then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonLevelResult.body).to.have.property('common_entity').to.be.an('object');
            expect(commonLevelResult.body.common_entity).to.have.property('id', testCaseData.expected.common_entity.id);
            expect(commonLevelResult.body.common_entity).to.have.property('name', testCaseData.expected.common_entity.name);
            expect(commonLevelResult.body.common_entity).to.have.property('description', testCaseData.expected.common_entity.description);
            expect(commonLevelResult.body).to.have.property('name', testCaseData.expected.name);
        });
    });
});