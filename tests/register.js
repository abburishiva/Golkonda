var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + 'user' + '/register',
    token = require('./tokens'),
    tokens = token.tokens,
    candidate = baseUrl + 'candidates',
    employer = baseUrl + 'employers',
    response,
    dynamicId;
process.envNODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("REGISTER", function () {
    var testSuite = this.title, candidateId, candidateEmail, empEmail, removeId;
    describe("NEW_CANDIDATE_REGISTER", function () {
        var getCases = this.title;
        it("TEST_FOR_NEW_CANDIDATE_REGISTER", function () {
            var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            candidateEmail = testCaseData.input.email_address;
            return chakram.post(url, testCaseData.input).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
                expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
            });
        });
    });
    describe("NEW_EMPLOYEE_REGISTER", function () {
        var getCases = this.title;
        it("TEST_FOR_NEW_EMPLOYEE_REGISTER", function () {
            var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            empEmail = testCaseData.input.email_address;
            return chakram.post(url, testCaseData.input).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body.data.code).to.equal(testCaseData.expected.data.code);
                expect(result.body.data.message).to.equal(testCaseData.expected.data.message);
            });
        });

    });

    function execute(a) {
        describe("DELETE_NEWLY_REGISTERED_CANDIDATE", function () {
            var getCases = this.title;
            it("TEST_FOR_DELETE_NEWLY_REGISTERED_CANDIDATE_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(candidate + '?limit=10&email=' + candidateEmail, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        if (result.body[0].user_profile.email === candidateEmail) {
                            removeId = result.body[0]._id;
                        }
                        return chakram.delete(candidate + '/' + removeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.deleteStatusCode);
                            return chakram.get(url + '/' + candidateId, {
                                headers: {'x-access-token': tokens[a].token},
                                json: false
                            }).then(function (getResult) {
                                expect(getResult.response.statusCode).to.equal(testCaseData.expected.getStatusCode);
                            });
                        });
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("DELETE_NEWLY_REGISTERED_EMPLOYEE", function () {
            var getCases = this.title;
            it("TEST_FOR_DELETE_NEWLY_REGISTERED_EMPLOYEE_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(employer + '?email=' + empEmail, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        if (result.body[0].user_profile.email === empEmail) {
                            removeId = result.body[0]._id;
                        }
                        return chakram.delete(employer + '/' + removeId, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.deleteStatusCode);
                            return chakram.get(employer + '/' + removeId, {
                                headers: {'x-access-token': tokens[a].token},
                                json: false
                            }).then(function (getResult) {
                                expect(getResult.response.statusCode).to.equal(testCaseData.expected.getStatusCode);
                            });
                        });
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
    }

    describe("CANDIDATE_REGISTERING_AS_EMPLOYEE", function () {
        var getCases = this.title;
        it("TEST_FOR_CANDIDATE_REGISTERING_AS_EMPLOYEE", function () {
            var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.post(url, testCaseData.input).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected.code);
                expect(result.body.message).to.equal(testCaseData.expected.message);
            });
        });
    });
    describe("EXISTING_CANDIDATE_REGISTERING_WITH_REGISTERED_EMAIL", function () {
        var getCases = this.title;
        it("TEST_FOR_EXISTING_CANDIDATE_REGISTERING_WITH_REGISTERED_EMAIL", function () {
            var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.post(url, testCaseData.input).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                expect(result.body.message).to.equal(testCaseData.expected.message);
            });
        });
    });


    describe("EMPLOYEE_REGISTERING_AS_CANDIDATE", function () {
        var getCases = this.title;
        it("TEST_FOR_EMPLOYEE_REGISTERING_AS_CANDIDATE", function () {
            var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.post(url, testCaseData.input).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(result.body.message).to.equal(testCaseData.expected.message);
            });
        });
    });

    describe("EXISTING_EMPLOYEE_REGISTERING_WITH_REGISTERED_EMAIL", function () {
        var getCases = this.title;
        it("TEST_FOR_EXISTING_EMPLOYEE_REGISTERING_WITH_REGISTERED_EMAIL", function () {
            var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.post(url, testCaseData.input).then(function (result) {
                expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(result.body.message).to.equal(testCaseData.expected.message);
            });
        });
    });

    for (var i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
