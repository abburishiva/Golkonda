var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    commonUrl = baseUrl + 'candidates/:id/interviews',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CANDIDATES_INTERVIEWS_FOR_CANDIDATES_AND_EMPLOYERS", function () {
    var testSuite = this.title, currentDate, m, k, interviewDate, dynamicId, i, url = baseUrl + 'candidates/591af1d85a19a2354ce16caa/interviews';
    this.timeout(30000);
    function execute(a) {
        var empRecordId, empResponse, currentDate, allowTime, candidateResponse, postResponse, updateData, emp_url, candidate_url, candidateRecordId;
        describe("GET_UPCOMING_CANDIDATES_INTERVIEWS", function () {
            var getCases = this.title;
            it("GET_ALL_UPCOMING_CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var path = '?offset=420&zone=America/Los_Angeles&status=upcoming', testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews';
                    empResponse = chakram.get(emp_url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        function empResults(j) {
                            empRecordId = result.body[0]._id;
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties._id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.level.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.total_time);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.attempted);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.email);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                            expect(result.body[j].interviewDetail.emp_id).to.equal(emp_id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                            expect(result.body[j].questions).to.be.an('array');
                            interviewDate = new Date(result.body[j].interviewDetail.interviewExpiredDateTime).getTime() + (60 * 60000);
                            currentDate = new Date();
                            allowTime = new Date(interviewDate);
                            expect(allowTime > currentDate).to.be.true;
                        }

                        for (m = 0; m < result.response.headers['x-total-count']; m = m + 1) {
                            empResults(m);
                        }
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews';
                    candidateResponse = chakram.get(candidate_url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        if (result.response.headers['x-total-count'] > 0) {
                            function candidateResults(l) {
                                candidateRecordId = result.body[0]._id;
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties._id);
                                expect(result.body[l].email).to.equal(testCaseData.expected.properties.email);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.level.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.total_time);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.attempted);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.email);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                                expect(result.body[0].questions).to.be.an('array');
                                interviewDate = new Date(result.body[l].interviewDetail.interviewExpiredDateTime).getTime() + (60 * 60000);
                                currentDate = new Date();
                                allowTime = new Date(interviewDate);
                                expect(allowTime > currentDate).to.be.true;
                            }

                            for (k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                                candidateResults(k);
                            }
                        }
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    response = chakram.get(url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("GET_CANDIDATES_INTERVIEWS_WITH_VALID_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews/' + empRecordId;
                    empResponse = chakram.get(emp_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body._id).to.be.equal(empRecordId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.type);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.level.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.time_taken);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.total_time);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.attempted);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.email);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                        expect(result.body.interviewDetail.emp_id).to.equal(emp_id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                        expect(result.body.questions).to.be.an('array');
                        interviewDate = new Date(result.body.interviewDetail.interviewExpiredDateTime).getTime() + (60 * 60000);
                        currentDate = new Date();
                        allowTime = new Date(interviewDate);
                        expect(allowTime > currentDate).to.be.true;
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews/' + candidateRecordId;
                    empResponse = chakram.get(candidate_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body._id).to.be.equal(candidateRecordId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.type);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.level.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.time_taken);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.total_time);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.attempted);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.email);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                        expect(result.body.questions).to.be.an('array');
                        interviewDate = new Date(result.body.interviewDetail.interviewExpiredDateTime).getTime() + (60 * 60000);
                        currentDate = new Date();
                        allowTime = new Date(interviewDate);
                        expect(allowTime > currentDate).to.be.true;
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    response = chakram.get(url + '/' + candidateRecordId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("GET_EXPIRED_CANDIDATES_INTERVIEWS", function () {
            var getCases = this.title;
            it("GET_ALL_EXPIRED_CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var path = '?zone=America/Los_Angeles&status=expired', testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews';
                    empResponse = chakram.get(emp_url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        function empResults(j) {
                            empRecordId = result.body[0]._id;
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties._id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.level.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.total_time);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.attempted);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.email);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                            expect(result.body[j].interviewDetail.emp_id).to.equal(emp_id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                            expect(result.body[j].questions).to.be.an('array');
                            interviewDate = new Date(result.body[j].interviewDetail.interviewStartDateTime);
                            currentDate = new Date();
                            expect(interviewDate < currentDate).to.be.true;
                        }

                        for (k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                            empResults(k);
                        }
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews';
                    candidateResponse = chakram.get(candidate_url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        if (result.response.headers['x-total-count'] > 0) {
                            function candidateResults(l) {
                                candidateRecordId = result.body[0]._id;
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties._id);
                                expect(result.body[l].email).to.equal(testCaseData.expected.properties.email);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.level.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.total_time);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.attempted);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.email);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                                expect(result.body[0].questions).to.be.an('array');
                                interviewDate = new Date(result.body[l].interviewDetail.interviewStartDateTime);
                                currentDate = new Date();
                                expect(interviewDate < currentDate).to.be.true;
                            }

                            for (k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                                candidateResults(k);
                            }
                        }
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    response = chakram.get(url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("GET_CANDIDATES_INTERVIEWS_WITH_VALID_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews/' + empRecordId;
                    empResponse = chakram.get(emp_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body._id).to.be.equal(empRecordId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.type);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.level.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.time_taken);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.total_time);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.attempted);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.email);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                        expect(result.body.interviewDetail.emp_id).to.equal(emp_id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                        expect(result.body.questions).to.be.an('array');
                        interviewDate = new Date(result.body.interviewDetail.interviewStartDateTime);
                        currentDate = new Date();
                        expect(interviewDate < currentDate).to.be.true;
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews/' + candidateRecordId;
                    empResponse = chakram.get(candidate_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body._id).to.be.equal(candidateRecordId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.type);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.level.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.time_taken);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.total_time);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.attempted);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.email);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                        expect(result.body.questions).to.be.an('array');
                        interviewDate = new Date(result.body.interviewDetail.interviewStartDateTime);
                        currentDate = new Date();
                        expect(interviewDate < currentDate).to.be.true;
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    response = chakram.get(url + '/' + candidateRecordId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("GET_COMPLETED_CANDIDATES_INTERVIEWS", function () {
            var getCases = this.title;
            it("GET_ALL_COMPLETED_CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var path = '?zone=America/Los_Angeles&status=completed', testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews';
                    empResponse = chakram.get(emp_url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        function empResults(j) {
                            empRecordId = result.body[0]._id;
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties._id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.level.name);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.total_time);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.attempted);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.email);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                            expect(result.body[j].interviewDetail.emp_id).to.equal(emp_id);
                            expect(result.body[j].hasOwnProperty(candidate_id));
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                            expect(result.body[j]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                            expect(result.body[j].questions).to.be.an('array');

                        }

                        for (k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                            empResults(k);
                        }
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews';
                    candidateResponse = chakram.get(candidate_url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        if (result.response.headers['x-total-count'] > 0) {
                            function candidateResults(l) {
                                candidateRecordId = result.body[0]._id;
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties._id);
                                expect(result.body[l].candidate_id).to.be.equal(candidate_id);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.email);
                                expect(result.body[l].email).to.equal(testCaseData.expected.properties.email);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.type);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.id);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.subject.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.level.name);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.time_taken);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.total_time);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.attempted);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                                expect(result.body[l]).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                                expect(result.body[l].questions).to.be.an('array');
                            }

                            for (k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                                candidateResults(k);
                            }
                        }
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    var response = chakram.get(url + path, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("GET_CANDIDATES_INTERVIEWS_WITH_VALID_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews/' + empRecordId;
                    empResponse = chakram.get(emp_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body._id).to.be.equal(empRecordId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.type);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.level.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.time_taken);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.total_time);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.attempted);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.email);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                        expect(result.body.interviewDetail.emp_id).to.equal(emp_id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                        expect(result.body.questions).to.be.an('array');
                        interviewDate = new Date(result.body.interviewDetail.interviewStartDateTime);
                        currentDate = new Date();
                        expect(interviewDate < currentDate).to.be.true;
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews/' + candidateRecordId;
                    empResponse = chakram.get(candidate_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body._id).to.be.equal(candidateRecordId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.type);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.id);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.subject.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.challengeCreatedDatetime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.makeChallenge);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.quiz.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.level.name);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.time_taken);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.total_time);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.attempted);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.email);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.timeLeft);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.startAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.expiredAtDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.definitionId);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewerEmail);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewStartDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.interviewExpiredDateTime);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.live);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.collaboration);
                        expect(result.body).hasOwnProperty(testCaseData.expected.properties.interviewDetail.access.screenSharing);
                        expect(result.body.questions).to.be.an('array');
                        interviewDate = new Date(result.body.interviewDetail.interviewStartDateTime);
                        currentDate = new Date();
                        expect(interviewDate < currentDate).to.be.true;
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    response = chakram.get(url + '/' + candidateRecordId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
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
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id,
                        posturl = 'candidates/' + emp_id + '/interviews';
                    empResponse = chakram.post(baseUrl + posturl, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
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
                        expect(result.body[0].interviewDetail.emp_id).to.equal(emp_id);
                        expect(result.body[0].interviewDetail.interviewStartDateTime).not.to.be.undefined;
                        expect(result.body[0].interviewDetail.interviewExpiredDateTime).not.to.be.undefined;
                        expect(result.body[0].email).to.equal(testCaseData.expected.email);
                        expect(result.body[0].emp_id).to.equal(testCaseData.expected.emp_id);
                        expect(result.body[0].questions).to.be.an('array');
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id,
                        post_url = 'candidates/' + candidate_id + '/interviews';
                    candidateResponse = chakram.post(baseUrl + post_url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    postResponse = chakram.post(url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return postResponse.then(function (result) {
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
                if (tokens[a].role === "EMPLOYEE") {
                    var emp_id = tokens[a].id;
                    emp_url = baseUrl + 'candidates/' + emp_id + '/interviews/' + dynamicId;
                    empResponse = chakram.put(emp_url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return empResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        return chakram.get(emp_url, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.not.be.a('null');
                        expect(getResult.body).to.not.be.an('undefined');
                        expect(getResult.body.interviewDetail.emp_id).to.equal(emp_id);
                        expect(getResult.body.interviewDetail.interviewerName).to.equal(testCaseData.expected.interviewDetail.interviewerName);
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/interviews/' + dynamicId;
                    updateData = testCaseData.input;
                    updateData['candidate_id'] = candidate_id;
                    candidateResponse = chakram.put(candidate_url, updateData, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        return chakram.get(candidate_url, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.not.be.a('null');
                        expect(getResult.body).to.not.be.an('undefined');
                        expect(getResult.body.candidate_id).to.equal(candidate_id);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    postResponse = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                    return postResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("BASIC_DELETE", function () {
            var getCases = this.title;
            it("CANDIDATES_INTERVIEWS_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data' + '/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                return chakram.delete(url + '/' + dynamicId, null, {
                    headers: {'x-access-token': tokens[a].token},
                    json: false
                }).then(function (Result) {
                    if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                        expect(Result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    } else if (tokens[a].role === "NEW_USER") {
                        expect(Result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    }
                });
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
