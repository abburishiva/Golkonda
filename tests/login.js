/*global process,describe,it,i,execute*/
/*jslint nomen: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    data = require('./data/loginData.json'),
    url = baseUrl + 'user' + '/authenticate';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOGIN", function () {
    var testSuite = this.title;
    it("TEST_FOR_CANDIDATE_LOGIN", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);
            expect(result.body.userData.demo_details.id).to.equal(testCaseData.expected.userData.demo_details.id);
            expect(result.body.userData.demo_details.resume_id).to.equal(testCaseData.expected.userData.demo_details.resume_id);
            expect(result.body.userData.auth_details.registereddatetime).to.equal(testCaseData.expected.userData.auth_details.registereddatetime);
            expect(result.body.userData.auth_details.first_login_completed).to.equal(testCaseData.expected.userData.auth_details.first_login_completed);
            expect(result.body.userData.auth_details.is_user_verified).to.equal(testCaseData.expected.userData.auth_details.is_user_verified);
            expect(!result.body.userData.user_profile.name).to.be.false;
            expect(result.body.userData.user_profile.email).to.equal(testCaseData.expected.userData.user_profile.email);
            expect(result.body.userData.role).to.equal(testCaseData.expected.userData.role);
            expect(result.body.token).to.not.to.be.a('null');
        });
    });
    it("TEST_FOR_EMPLOYEE_LOGIN", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);
            expect(result.body.userData.employer_details._id).to.equal(testCaseData.expected.userData.employer_details._id);
            expect(result.body.userData.auth_details.registereddatetime).to.equal(testCaseData.expected.userData.auth_details.registereddatetime);
            expect(result.body.userData.auth_details.first_login_completed).to.equal(testCaseData.expected.userData.auth_details.first_login_completed);
            expect(result.body.userData.auth_details.is_user_verified).to.equal(testCaseData.expected.userData.auth_details.is_user_verified);
            expect(result.body.userData.auth_details.is_super).to.equal(testCaseData.expected.userData.auth_details.is_super);
            expect(result.body.userData.employer_details.company_name).to.equal(testCaseData.expected.userData.employer_details.company_name);
            expect(result.body.userData.employer_details.company_size).to.equal(testCaseData.expected.userData.employer_details.company_size);
            expect(result.body.userData.employer_details.job_title).to.equal(testCaseData.expected.userData.employer_details.job_title);
            expect(result.body.userData.employer_details.country_name).to.equal(testCaseData.expected.userData.employer_details.country_name);
            expect(!result.body.userData.user_profile.name).to.be.false;
            expect(result.body.userData.user_profile.email).to.equal(testCaseData.expected.userData.user_profile.email);
            expect(result.body.userData.user_profile.phone).to.equal(testCaseData.expected.userData.user_profile.phone);
            expect(result.body.userData.role).to.equal(testCaseData.expected.userData.role);
            expect(result.body.token).to.not.to.be.a('null');
        });
    });
    it("TEST_FOR_SUPER_LOGIN", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);
            expect(result.body.status).to.equal(testCaseData.expected.status);
            expect(result.body.userData.employer_details._id).to.equal(testCaseData.expected.userData.employer_details._id);
            expect(result.body.userData.auth_details.registereddatetime).to.equal(testCaseData.expected.userData.auth_details.registereddatetime);
            expect(result.body.userData.auth_details.first_login_completed).to.equal(testCaseData.expected.userData.auth_details.first_login_completed);
            expect(result.body.userData.auth_details.is_user_verified).to.equal(testCaseData.expected.userData.auth_details.is_user_verified);
            expect(result.body.userData.auth_details.is_super).to.equal(testCaseData.expected.userData.auth_details.is_super);
            expect(result.body.userData.employer_details.company_name).to.equal(testCaseData.expected.userData.employer_details.company_name);
            expect(result.body.userData.employer_details.company_size).to.equal(testCaseData.expected.userData.employer_details.company_size);
            expect(result.body.userData.employer_details.job_title).to.equal(testCaseData.expected.userData.employer_details.job_title);
            expect(result.body.userData.employer_details.country_name).to.equal(testCaseData.expected.userData.employer_details.country_name);
            expect(result.body.userData.user_profile.name).to.equal(testCaseData.expected.userData.user_profile.name);
            expect(result.body.userData.user_profile.email).to.equal(testCaseData.expected.userData.user_profile.email);
            expect(result.body.userData.user_profile.phone).to.equal(testCaseData.expected.userData.user_profile.phone);
            expect(result.body.userData.role).to.equal(testCaseData.expected.userData.role);
            expect(result.body.token).to.not.to.be.a('null');
        });
    });
    it("TEST_FOR_INVALID_USER_LOGIN", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);
        });
    });
    it("TEST_FOR_USER_LOGIN_WITH_WRONG_PASSWORD", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);

        });
    });
    it("TEST_FOR_USER_LOGIN_WITH_INCORRECT_USER_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.post(url, testCaseData.input).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
            expect(result.body.message).to.equal(testCaseData.expected.message);

        });
    });
});