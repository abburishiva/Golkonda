/*global process,describe,it,i,execute*/
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('../config/config.json'),
    data = require('../data/codeVerificationData.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "codeverification";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CODE_VERIFICATION_FOR_FORGOT_PASSWORD", function () {
    var testSuite = this.title,
        testSuiteData = {};
    this.timeout(30000);
   /* it("TEST_FOR_NEW_USER", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(206);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            /!*expect(result.body.data[0]._id).to.equal(testCaseData.expected.data[0]._id);
            expect(result.body.data[0].email).to.equal(testCaseData.expected.data[0].email);
            expect(result.body.data[0].password).to.equal(testCaseData.expected.data[0].password);
            expect(result.body.data[0].source).to.equal(testCaseData.expected.data[0].source);
            expect(result.body.data[0].code).to.equal(testCaseData.expected.data[0].code);
            expect(result.body.data[0].source_id).to.equal(testCaseData.expected.data[0].source_id);
            expect(result.body.data[0].name).to.equal(testCaseData.expected.data[0].name);*!/

        });
    });
    it("TEST_FOR_NEW_USER_WITH_EXCESS_CODE_LENGTH", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(206);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.message).to.equal(testCaseData.expected.message);
        });
    });
    it("TEST_FOR_NEW_USER_WITH_INSUFFICIENT_CODE_LENGTH", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(206);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.message).to.equal(testCaseData.expected.message);

        });
    });
    it("TEST_FOR_NEW_USER_WITH_INVALID_CODE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(206);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
        });
    });
    it("TEST_FOR_EXISTING_USER", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.data[0]._id).to.equal(testCaseData.expected.data[0]._id);
            expect(result.body.data[0].email).to.equal(testCaseData.expected.data[0].email);
            expect(result.body.data[0].password).to.equal(testCaseData.expected.data[0].password);
            expect(result.body.data[0].source).to.equal(testCaseData.expected.data[0].source);
            expect(result.body.data[0].code).to.equal(testCaseData.expected.data[0].code);
            expect(result.body.data[0].source_id).to.equal(testCaseData.expected.data[0].source_id);
            expect(result.body.data[0].name).to.equal(testCaseData.expected.data[0].name);
        });
    });*/
   /* it("TEST_FOR_EXISTING_USER_WITH_INVALID_CODE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(206);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
        });
    });*/
});



