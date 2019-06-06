var chakram = require('chakram'),
    token = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../config/config.json'),
    data = require('../data/data.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/statuses",
    tokens = token.tokens;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
describe("COMMON_STATUS", function () {
    var testSuiteData = {}, i, dynamicId, name, testSuite = this.title;
    it("BASIC_GET_ALL", function () {
        var d, testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5').then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            dynamicId = commonLevelResult.body[0].id;
            name = commonLevelResult.body[0].name;
            expect(commonLevelResult.body[0]).to.have.property('name');
            expect(commonLevelResult.body[0]).to.have.property('entityid');
            expect(commonLevelResult.body[0]).to.have.property('description');
            expect(commonLevelResult.body[0]).to.have.property('enabled');
            expect(commonLevelResult.body[0]).to.have.property('lastmoddatetime');
            d = new Date(commonLevelResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            count, verify = true, result, testResult,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5&sort=id').then(function (commonLevelResult) {

            if (commonLevelResult.body.length) {
                var idArray = commonLevelResult.body.map(function (item) {
                    return item.id;
                });

                function compareId(currentId, nextId) {
                    return currentId <= nextId;
                }

                for (i = 0; i < idArray.length - 1; i++) {
                    result = compareId(idArray[i], idArray[i + 1]);
                    expect(commonLevelResult.response.statusCode).to.equal(200);
                    expect(commonLevelResult.response.headers['content-type']).to.equal("application/json; charset=utf-8");
                    expect(commonLevelResult.body).to.not.be.a('null');
                    expect(commonLevelResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                if (verify) {
                    testResult = compareId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    it("GET_ALL_FILTERING_BY_ENTITY", function () {
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
                expect(!commonLevelResult.body[i].id).to.be.false;
                expect(!commonLevelResult.body[i].entityid).to.be.false;
                expect(!commonLevelResult.body[i].name).to.be.false;
                expect(!commonLevelResult.body[i].description).to.be.false;
            }
        });
    });
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&name=" + name).then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            for (i = 0; i < commonLevelResult.body.length; i = i + 1) {
                expect(commonLevelResult.body[i]).to.have.property('id');
                expect(commonLevelResult.body[i]).to.have.property('entityid');
                expect(commonLevelResult.body[i]).to.have.property('name', name);
                expect(commonLevelResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?limit=5&sort=name&entityid=" + testCaseData.input.entityid).then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            var count = commonLevelResult.body.length;
            for (i = 0; i < commonLevelResult.body.length; i = i + 1) {
                expect(!commonLevelResult.body[i].entityid).to.be.false;
                expect(!commonLevelResult.body[i].description).to.be.false;
                expect(!commonLevelResult.body[i].id).to.be.false;
                expect(!commonLevelResult.body[i].name).to.be.false;
            }
        });
    });
    it("GET_ONE", function () {
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
});
