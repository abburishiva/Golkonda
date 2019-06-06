var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    tokens = token.tokens,
    choiceQuestionsUrl = baseUrl + 'choice/questions',
    url = baseUrl + "candidates/591af1d85a19a2354ce16caa/challenges";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CANDIDATE_CHALLENGES", function () {
    var testSuite = this.title, candidateResponse, getBySubject, postData, updateData, dynamicId, candidate_url, i, candidateRecordId, response, date, currentTime, responseDate, challengedatetime;
    this.timeout(80000);
    function execute(a) {
        describe("BASIC_GET_ALL", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_ALL_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(80000);
                response = chakram.get(url, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result).to.have.status(testCaseData.expected.statusCode);
                        if (result.body.length > 0) {
                            candidateRecordId = result.body[0]._id;
                            for (i = 0; i < result.body.length; i = i + 1) {
                                expect(result.body[i]).to.hasOwnProperty(candidate_id);
                            }
                        }
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/challenges';
                    candidateResponse = chakram.get(candidate_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal('application/json; charset=utf-8');
                        if (result.response.headers['x-total-count'] > 0) {
                            function candidateResults(l) {
                                candidateRecordId = result.body[0]._id;
                                expect(!result.body[l]._id).to.be.false;
                                expect(result.body[l].candidate_id).to.be.equal(candidate_id);
                                expect(!result.body[l].subject.id).to.be.false;
                                expect(!result.body[l].subject.name).to.be.false;
                                expect(!result.body[l].challengedatetime).to.be.false;
                                expect(!result.body[l].quiz.name).to.be.false;
                                expect(!result.body[l].level.name).to.be.false;
                                expect(result.body[l].questions).to.be.an('array');
                                expect(!result.body[l].total_time).to.be.false;
                            }

                            for (var k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                                candidateResults(k);
                            }
                        }
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("TEST_FOR_BASIC_GET_BY_ID_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);

                response = chakram.get(url + '/' + candidateRecordId, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected.statusCode);
                        expect(result.body).to.not.be.an('undefined');
                        expect(!result.body.candidate_id).to.be.false;
                        expect(!result.body.challengedatetime).to.be.false;
                        expect(!result.body.subject.id).to.be.false;
                        expect(!result.body.subject.name).to.be.false;
                        expect(!result.body.challengedatetime).to.be.false;
                        expect(!result.body.quiz.name).to.be.false;
                        expect(!result.body.level.name).to.be.false;
                        expect(result.body.questions).to.be.an('array');
                        expect(!result.body.total_time).to.be.false;
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/challenges/' + candidateRecordId;
                    candidateResponse = chakram.get(candidate_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return candidateResponse.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal('application/json; charset=utf-8');
                        if (result.response.headers['x-total-count'] > 0) {
                            expect(result.body._id).to.be.equal(candidateRecordId);
                            expect(result.body.candidate_id).to.be.equal(candidate_id);
                            expect(!result.body.subject.id).to.be.false;
                            expect(!result.body.subject.name).to.be.false;
                            expect(!result.body.challengedatetime).to.be.false;
                            expect(!result.body.quiz.name).to.be.false;
                            expect(!result.body.level.name).to.be.false;
                            expect(result.body.questions).to.be.an('array');
                            expect(!result.body.total_time).to.be.false;
                        }
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.be.equal(testCaseData.expected.statusCode);
                    });
                }
            });

        });
        describe("TEST_FOR_BASIC_GET_BY_SUBJECT", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_BY_SUBJECT_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '?subject=' + testCaseData.input.subject, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result).to.have.status(testCaseData.expected.statusCode);
                        for (i = 0; i < result.body.length; i = i + 1) {
                            expect(result.body[i].subject.name).to.equal(testCaseData.input.subject);
                            expect(!result.body[i].subject.id).to.be.false;
                            expect(!result.body[i].challengedatetime).to.be.false;
                            expect(!result.body[i].quiz.name).to.be.false;
                            expect(!result.body[i].level.name).to.be.false;
                            expect(result.body[i].questions).to.be.an('array');
                            expect(!result.body[i].total_time).to.be.false;
                        }
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/challenges?subject=' + testCaseData.input.subject;
                    getBySubject = chakram.get(candidate_url, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return getBySubject.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers['content-type']).to.equal('application/json; charset=utf-8');
                        if (result.response.headers['x-total-count'] > 0) {
                            function candidateResults(l) {
                                expect(result.body[l].subject.name).to.equal(testCaseData.input.subject);
                                expect(result.body[l].candidate_id).to.be.equal(candidate_id);
                                expect(!result.body[l].subject.id).to.be.false;
                                expect(!result.body[l].subject.name).to.be.false;
                                expect(!result.body[l].challengedatetime).to.be.false;
                                expect(!result.body[l].quiz.name).to.be.false;
                                expect(!result.body[l].level.name).to.be.false;
                                expect(result.body[l].questions).to.be.an('array');
                                expect(!result.body[l].total_time).to.be.false;
                            }

                            for (var k = 0; k < result.response.headers['x-total-count']; k = k + 1) {
                                candidateResults(k);
                            }
                        }
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("BASIC_POST", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_POST_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/challenges';
                    postData = chakram.post(candidate_url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return postData.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        expect(result.body.candidate_id).to.equal(candidate_id);
                        expect(result.body.subject.id).to.equal(testCaseData.input.subjectid);
                        expect(result.body.level.id).to.equal(testCaseData.input.levelid);
                        expect(result.body.quiz.name).to.equal(testCaseData.input.quiztype);
                        dynamicId = result.body._id;
                        date = new Date().toISOString();
                        currentTime = date.split('T');
                        responseDate = result.body.challengedatetime;
                        challengedatetime = responseDate.split('T');
                        return chakram.get(candidate_url + '/' + dynamicId, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        }).then(function (result) {
                            expect(result.body).to.not.be.an('undefined');
                            expect(result.body.candidate_id).to.equal(candidate_id);
                            expect(currentTime[0]).to.equal(challengedatetime[0]);
                            expect(!result.body.total_time).to.be.false;
                            expect(!result.body.quiz.name).to.be.false;
                            expect(!result.body.subject.id).to.be.false;
                            expect(!result.body.subject.name).to.be.false;
                            expect(!result.body.level.id).to.be.false;
                            expect(!result.body.level.name).to.be.false;
                        });
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("BASIC_PUT", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_PUT_" + tokens[a].role, function () {
                var levelid,
                    testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                if (tokens[a].role === "CANDIDATE") {
                    var candidate_id = tokens[a].id;
                    candidate_url = baseUrl + 'candidates/' + candidate_id + '/challenges/' + dynamicId;
                    updateData = chakram.put(candidate_url, testCaseData.input, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return updateData.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        return chakram.get(candidate_url, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        }).then(function (result) {
                            expect(result.body.candidate_id).to.equal(candidate_id);
                            expect(result.body.subject.name).to.equal(testCaseData.input.subject.name);
                            levelid = result.body.level.id;
                            return chakram.get(choiceQuestionsUrl + '?levelid=' + levelid, {
                                headers: {'x-access-token': tokens[a].token},
                                json: true
                            }).then(function (result) {
                                for (i = 0; i < result.body.length; i = i + 1) {
                                    expect(result.body[i]).to.have.property('choice1');
                                    expect(result.body[i]).to.have.property('choice2');
                                    expect(result.body[i]).to.have.property('choice3');
                                    expect(result.body[i]).to.have.property('choice4');
                                    if (result.body[i].levelid === levelid) {
                                        expect(result.body[i].levelid).to.be.equal(levelid);
                                    }
                                }
                            });
                        });
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("BASIC_DELETE", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                chakram.delete(url + '/' + dynamicId, null, {
                    headers: {'x-access-token': tokens[a].token},
                    json: false
                }).then(function (result) {
                    if (tokens[a].role === "CANDIDATE") {
                        var candidate_id = tokens[a].id;
                        candidate_url = baseUrl + 'candidates/' + candidate_id + '/challenges/' + dynamicId;
                        return chakram.delete(candidate_url, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (Result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    } else if (tokens[a].role === "NEW_USER") {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    }
                })
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
