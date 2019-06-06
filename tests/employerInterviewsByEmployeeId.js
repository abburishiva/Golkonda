var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    tokens = token.tokens,
    superUrl = baseUrl + 'employers_interviews',
    employerUrl = baseUrl + 'employers/';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMPLOYER_INTERVIEWS", function () {
    var testSuite = this.title, i, interviewId, superResponse, response, url;

    function execute(a) {
        describe("BASIC_GET_EMPLOYER_INTERVIEWS", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_ALL_EMPLOYER_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                url = employerUrl + tokens[a].id + '/interviews';
                response = chakram.get(url, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    superResponse = chakram.get(superUrl, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return superResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        interviewId = result.body[0]._id;
                        function repeatArray(k) {
                            expect(!result.body[k]._id).to.be.false;
                            expect(!result.body[k].emp_id).to.be.false;
                            expect(result.body[k].events).to.be.an.array;
                        }

                        for (i = 0; i < result.body.length; i++) {
                            repeatArray(i);
                        }
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        interviewId = result.body[0]._id;
                        function repeatArray(k) {
                            expect(!result.body[k]._id).to.be.false;
                            expect(!result.body[k].emp_id).to.be.false;
                            expect(result.body[k].events).to.be.an.array;
                            expect(result.body[k].emp_id).to.be.equal(tokens[a].id);
                        }

                        for (i = 0; i < result.body.length; i++) {
                            repeatArray(i);
                        }
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("TEST_FOR_BASIC_GET_EMPLOYER_INTERVIEW_BY_INTERVIEW_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                url = employerUrl + tokens[a].id + '/interviews/' + interviewId;
                this.timeout(30000);
                response = chakram.get(url, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    superResponse = chakram.get(superUrl + '/' + interviewId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return superResponse.then(function (result) {
                        expect(result).to.have.status(testCaseData.expected.statusCode);
                        expect(result.body).to.not.be.an('undefined');
                        expect(!result.body._id).to.be.false;
                        expect(!result.body.emp_id).to.be.false;
                        expect(result.body.event).to.be.an.array;
                    });
                }
                else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result).to.have.status(testCaseData.expected.statusCode);
                        expect(result.body).to.not.be.an('undefined');
                        expect(result.body.emp_id).to.be.equal(tokens[a].id);
                        expect(result.body._id).to.be.equal(interviewId);
                        expect(!result.body.emp_id).to.be.false;
                        expect(result.body.event).to.be.an.array;
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
        describe("EMPLOYER_INTERVIEWS_BASIC_POST", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_POST_EMPLOYER_INTERVIEW_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (!tokens[a].isSuper) {
                    url = employerUrl + tokens[a].id + '/interviews';
                    if (tokens[a].role !== "NEW_USER") {
                        testCaseData.input["emp_id"] = tokens[a].id;
                    }
                    response = chakram.post(url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                }
                if (tokens[a].role === "SUPER") {
                    superResponse = chakram.post(superUrl, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return superResponse.then(function (result) {
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        expect(result.body).to.be.an('object');
                        expect(result.body.type).to.be.an.array;
                        interviewId = result.body._id;
                        return chakram.get(superUrl + '/' + interviewId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        }).then(function (result) {
                            expect(result.response.headers["content-type"]).to.be.equal("application/json; charset=utf-8");
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.body).to.be.an('object');
                            expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                            expect(result.body.type).to.be.an.array;
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                            }
                        });
                    });
                }
                else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        expect(result.body.emp_id).to.equal(tokens[a].id);
                        expect(result.body.type).to.be.an.array;
                        for (i = 0; i < result.body.events.length; i = i + 1) {
                            expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                        }
                        interviewId = result.body._id;
                        return chakram.get(url + '/' + interviewId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        }).then(function (result) {
                            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.body).to.be.an('object');
                            expect(result.body.emp_id).to.equal(tokens[a].id);
                            expect(result.body.type).to.be.an.array;
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                            }
                        });
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });

        describe("EMPLOYER_INTERVIEWS_BASIC_PUT", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_PUT_EMPLOYER_INTERVIEW_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (!tokens[a].isSuper) {
                    url = employerUrl + tokens[a].id + '/interviews/' + interviewId;
                    if (tokens[a].role !== "NEW_USER") {
                        testCaseData.input["emp_id"] = tokens[a].id;
                    }
                    response = chakram.put(url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                }
                if (tokens[a].role === "SUPER") {
                    superResponse = chakram.put(superUrl + '/' + interviewId, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return superResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.body.n).to.equal(testCaseData.expected.n);
                        expect(result.body.nModified).to.equal(testCaseData.expected.nModified);
                        expect(result.body.ok).to.equal(testCaseData.expected.ok);
                        return chakram.get(superUrl + '/' + interviewId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        }).then(function (result) {
                            expect(result.body.type).to.be.an.array;
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.input.events[i]);
                            }
                        });
                    });
                }
                else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.body.n).to.equal(testCaseData.expected.n);
                        expect(result.body.nModified).to.equal(testCaseData.expected.nModified);
                        expect(result.body.ok).to.equal(testCaseData.expected.ok);
                        return chakram.get(url, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        }).then(function (result) {
                            expect(result.body.emp_id).to.equal(tokens[a].id);
                            expect(result.body.type).to.be.an.array;
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.input.events[i]);
                            }
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
        describe("EMPLOYER_INTERVIEWS_BASIC_DELETE", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (!tokens[a].isSuper) {
                    url = employerUrl + tokens[a].id + '/interviews/' + interviewId;
                    response = chakram.delete(url, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    });
                }
                if (tokens[a].role === "SUPER") {
                    return chakram.delete(superUrl + '/' + interviewId, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.deleteStatusCode);
                        return chakram.get(superUrl + '/' + interviewId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(testCaseData.expected.getStatusCode);
                        });
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.deleteStatusCode);
                        return chakram.get(url, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(testCaseData.expected.getStatusCode);
                        });
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});


