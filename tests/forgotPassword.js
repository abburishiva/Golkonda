/*global process,describe,it,i,execute*/
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    data = require('./data/forgotPassword.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + 'user' + '/forgotpassword';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("FORGOT_PASSWORD", function () {
    var testSuite = this.title;
    it("TEST_FOR_EXISTING_USER", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
       this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
            expect(result.body.data.message).to.equal(testCaseData.expected.data.message);

        });
    });
    it("TEST_FOR_EXISTING_USER_WITH_NO_REDIRECTION_URL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.data.status).to.equal(testCaseData.expected.data.status);
            expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);

        });
    });
    it("TEST_FOR_EXISTING_USER_WITH_NO_MESSAGE_TYPE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.code).to.equal(testCaseData.expected.code);
            expect(result.body.message).to.equal(testCaseData.expected.message);
        });
    });
    it("TEST_FOR_EXISTING_USER_WITH_NO_APP_TYPE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body.code).to.equal(testCaseData.expected.code);
            expect(result.body.message).to.equal(testCaseData.expected.message);
        });
    });
    it("TEST_FOR_EXISTING_USER_WITH_INVALID_DOMAIN", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.message).to.equal(testCaseData.expected.message);

        });
    });
    it("TEST_FOR_NOT_EXISTING_USER", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.message).to.equal(testCaseData.expected.message);

        });
    });
});
