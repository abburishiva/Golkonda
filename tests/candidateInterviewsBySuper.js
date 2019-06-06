var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    url = baseUrl + 'candidates_interviews',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CANDIDATES_INTERVIEWS", function () {
    var testSuite = this.title, response, i, dynamicId;
    this.timeout(30000);
    function execute(a) {
        describe("GET_UPCOMING_CANDIDATES_INTERVIEWS", function () {
            var getCases = this.title;
            it("GET_ALL_UPCOMING_CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '?status=upcoming&offset=420&zone=America/Los_Angeles', {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        if (result.response.headers['x-total-count'] > 0) {
                            for (i = 0; i < result.response.headers['x-total-count']; i = i + 1) {
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties._id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.level.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.total_time);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.attempted);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.email);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.emp_id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                                expect(result.body[0].questions).to.be.an('array');
                                var interviewDate = new Date(result.body[i].interviewDetail.interviewStartDateTime), currentDate = new Date().toISOString()
                                expect(interviewDate < currentDate).to.be.false;
                            }
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
            it("GET_CANDIDATES_INTERVIEWS_WITH_VALID_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        if (result.response.statusCode === testCaseData.expected.statusCode) {
                            expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.body._id).to.equal(testCaseData.input.id);
                            expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                            expect(result.body.type).to.equal(testCaseData.expected.type);
                            expect(result.body.challengeId).to.equal(testCaseData.expected.challengeId);
                            expect(result.body.startDate).to.equal(testCaseData.expected.startDate);
                            expect(result.body.endDate).to.equal(testCaseData.expected.endDate);
                            expect(result.body.expiredTime).to.equal(testCaseData.expected.expiredTime);
                            expect(result.body.access.live).to.equal(testCaseData.expected.access.live);
                            expect(result.body.access.collaboration).to.equal(testCaseData.expected.access.collaboration);
                            expect(result.body.access.screenSharing).to.equal(testCaseData.expected.access.screenSharing);
                            expect(result.body.access.public).to.equal(testCaseData.expected.access.public);
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                            }
                        }
                        else if (result.response.statusCode === testCaseData.ifNoRecords.statusCode) {
                            expect(result.body.status).to.equal(testCaseData.ifNoRecords.status);
                            expect(result.body.message).to.equal(testCaseData.ifNoRecords.message);
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
            it("GET_CANDIDATES_INTERVIEWS_BY_ID_WITH_INVALID_ROUTE_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        if (result.response.statusCode === testCaseData.expected.status) {
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.response.headers['x-total-count']).to.be.greaterThan(testCaseData.expected.count);
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
        describe("GET_EXPIRED_CANDIDATES_INTERVIEWS", function () {
            var getCases = this.title;
            it("GET_ALL_EXPIRED_CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(60000);
                response = chakram.get(url + '?status=expired&zone=America/Los_Angeles', {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        if (result.response.headers['x-total-count'] > 0) {
                            for (i = 0; i < result.response.headers['x-total-count']; i = i + 1) {
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties._id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.level.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.total_time);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.attempted);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.email);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.emp_id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                                var interviewDate = new Date(result.body[i].interviewDetail.interviewStartDateTime), currentDate = new Date().toISOString()
                                expect(interviewDate > currentDate).to.be.false;
                            }
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
            it("GET_CANDIDATES_INTERVIEWS_WITH_VALID_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        if (result.response.statusCode === testCaseData.expected.statusCode) {
                            expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.body._id).to.equal(testCaseData.input.id);
                            expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                            expect(result.body.type).to.equal(testCaseData.expected.type);
                            expect(result.body.challengeId).to.equal(testCaseData.expected.challengeId);
                            expect(result.body.startDate).to.equal(testCaseData.expected.startDate);
                            expect(result.body.endDate).to.equal(testCaseData.expected.endDate);
                            expect(result.body.expiredTime).to.equal(testCaseData.expected.expiredTime);
                            expect(result.body.access.live).to.equal(testCaseData.expected.access.live);
                            expect(result.body.access.collaboration).to.equal(testCaseData.expected.access.collaboration);
                            expect(result.body.access.screenSharing).to.equal(testCaseData.expected.access.screenSharing);
                            expect(result.body.access.public).to.equal(testCaseData.expected.access.public);
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                            }
                        }
                        else if (result.response.statusCode === testCaseData.ifNoRecords.statusCode) {
                            expect(result.body.status).to.equal(testCaseData.ifNoRecords.status);
                            expect(result.body.message).to.equal(testCaseData.ifNoRecords.message);
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
            it("GET_CANDIDATES_INTERVIEWS_BY_ID_WITH_INVALID_ROUTE_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        if (result.response.statusCode === testCaseData.expected.status) {
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.response.headers['x-total-count']).to.be.greaterThan(testCaseData.expected.count);
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
        describe("GET_COMPLETED_CANDIDATES_INTERVIEWS", function () {
            var getCases = this.title;
            it("GET_ALL_COMPLETED_CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '?status=completed&zone=America/Los_Angeles', {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        if (result.response.headers['x-total-count'] > 0) {
                            for (i = 0; i < result.response.headers['x-total-count']; i = i + 1) {
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties._id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.level.name);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.total_time);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.attempted);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.email);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.candidate_id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.emp_id);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                                expect(result.body[i]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                                var interviewDate = new Date(result.body[i].interviewDetail.interviewStartDateTime), currentDate = new Date().toISOString()
                                expect(interviewDate > currentDate).to.be.false;
                            }
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
            it("GET_CANDIDATES_INTERVIEWS_WITH_VALID_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        if (result.response.statusCode === testCaseData.expected.statusCode) {
                            expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                            expect(result.body).to.not.be.a('null');
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.body._id).to.equal(testCaseData.input.id);
                            expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                            expect(result.body.type).to.equal(testCaseData.expected.type);
                            expect(result.body.challengeId).to.equal(testCaseData.expected.challengeId);
                            expect(result.body.startDate).to.equal(testCaseData.expected.startDate);
                            expect(result.body.endDate).to.equal(testCaseData.expected.endDate);
                            expect(result.body.expiredTime).to.equal(testCaseData.expected.expiredTime);
                            expect(result.body.access.live).to.equal(testCaseData.expected.access.live);
                            expect(result.body.access.collaboration).to.equal(testCaseData.expected.access.collaboration);
                            expect(result.body.access.screenSharing).to.equal(testCaseData.expected.access.screenSharing);
                            expect(result.body.access.public).to.equal(testCaseData.expected.access.public);
                            for (i = 0; i < result.body.events.length; i = i + 1) {
                                expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                            }
                        }
                        else if (result.response.statusCode === testCaseData.ifNoRecords.statusCode) {
                            expect(result.body.status).to.equal(testCaseData.ifNoRecords.status);
                            expect(result.body.message).to.equal(testCaseData.ifNoRecords.message);
                        }
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
        describe("POST_CANDIDATES_INTERVIEWS", function () {
            var postCases = this.title;
            this.timeout(30000);
            it("WITH_VALID_DATA_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data' + '/' + testSuite + '/' + postCases + '.json'), testCaseData = data[postCases][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(201);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        dynamicId = result.body[0]._id;
                        expect(result.body[0].subject[0].name).to.equal(testCaseData.expected.subject[0].name);
                        expect(result.body[0].subject[0].id).to.equal(testCaseData.expected.subject[0].id);
                        expect(result.body[0].subject[0].categoryid).to.equal(testCaseData.expected.subject[0].categoryid);
                        expect(result.body[0].subject[0].mode).to.equal(testCaseData.expected.subject[0].mode);
                        expect(result.body[0].subject[0].icon_class).to.equal(testCaseData.expected.subject[0].icon_class);
                        expect(result.body[0].subject[0].flag).to.equal(testCaseData.expected.subject[0].flag);
                        expect(result.body[0].interviewDetail.interviewerEmail).to.equal(testCaseData.expected.interviewDetail.interviewerEmail);
                        expect(result.body[0].interviewDetail.definitionId).to.equal(testCaseData.expected.interviewDetail.definitionId);
                        expect(result.body[0].interviewDetail.emp_id).to.equal(testCaseData.expected.interviewDetail.emp_id);
                        expect(result.body[0].interviewDetail.interviewStartDateTime).not.to.be.undefined;
                        expect(result.body[0].interviewDetail.interviewExpiredDateTime).not.to.be.undefined;
                        expect(result.body[0].email).to.equal(testCaseData.expected.email);
                        expect(result.body[0].emp_id).to.equal(testCaseData.expected.emp_id);
                        expect(result.body[0].questions).to.be.an('array');
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
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
        describe("UPDATE_CANDIDATES_INTERVIEWS", function () {
            var updateCases = this.title;
            this.timeout(30000);
            it("WITH_VALID_DATA_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data' + '/' + testSuite + '/' + updateCases + '.json'), testCaseData = data[updateCases][testCase];
                this.timeout(30000);
                response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    'Content-Type': 'application/json',
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        return chakram.get(url + '/' + dynamicId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.not.be.a('null');
                        expect(getResult.body).to.not.be.an('undefined');
                        expect(getResult.body.type).to.equal(testCaseData.input.type);
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(403);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(401);
                    });
                }
            });
        });
        describe("DELETE", function () {
            it("CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                this.timeout(30000);
                return chakram.delete(url + '/' + dynamicId, null, {
                    headers: {'x-access-token': tokens[a].token},
                    json: false
                }).then(function (Result) {
                    if (tokens[a].role === "SUPER") {
                        expect(Result.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + dynamicId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    } else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                        expect(Result.response.statusCode).to.equal(403);
                    } else if (tokens[a].role === "NEW_USER") {
                        expect(Result.response.statusCode).to.equal(401);
                    }
                });
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
