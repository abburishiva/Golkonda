var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    url = baseUrl + 'employers_interviews',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("employerInterviews", function () {
    var testSuite = this.title, response, i, dynamicId;
    this.timeout(30000);
    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_EMPLOYER_INTERVIEWS_FOR_" + tokens[a].role, function () {
            this.timeout(30000);
            response = chakram.get(url, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.a('null');
                    expect(result.body).to.not.be.an('undefined');
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
        describe('getEmployerInterviewsById', function () {
            var getById = this.title;
            it("with valid interview Id for " + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getById + '.json'), testCaseData = data[getById][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        if (result.response.statusCode === testCaseData.expected.statusCode) {
                            expect(result.response.headers.content - type).to.equal(testCaseData.expected.headers.content - type);
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
            it("with invalid interview Id for " + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getById + '.json'), testCaseData = data[getById][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + testCaseData.input.id, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.status);
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        expect(result.body.error.message).to.equal(testCaseData.expected.error.message);
                        expect(result.body.error.name).to.equal(testCaseData.expected.error.name);
                        expect(result.body.error.stringValue).to.equal(testCaseData.expected.error.stringValue);
                        expect(result.body.error.kind).to.equal(testCaseData.expected.error.kind);
                        expect(result.body.error.value).to.equal(testCaseData.expected.error.value);
                        expect(result.body.error.path).to.equal(testCaseData.expected.error.path);
                    });
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.body.error.message).to.equal(testCaseData.expected.error.message);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("with invalid route for " + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getById + '.json'), testCaseData = data[getById][testCase];
                this.timeout(30000);
                response = chakram.get(url + '?' + testCaseData.input.id, {
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
        describe("postEmployeeInterview", function () {
            var postInterview = this.title;
            this.timeout(30000);
            it("with valid data for " + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data' + '/' + testSuite + '/' + postInterview + '.json'), testCaseData = data[postInterview][testCase];
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
                        dynamicId = result.body._id;
                        expect(result.body.subject[0].name).to.equal(testCaseData.expected.subject[0].name);
                        expect(result.body.subject[0].id).to.equal(testCaseData.expected.subject[0].id);
                        expect(result.body.subject[0].categoryid).to.equal(testCaseData.expected.subject[0].categoryid);
                        expect(result.body.subject[0].mode).to.equal(testCaseData.expected.subject[0].mode);
                        expect(result.body.subject[0].icon_class).to.equal(testCaseData.expected.subject[0].icon_class);
                        expect(result.body.subject[0].flag).to.equal(testCaseData.expected.subject[0].flag);
                        expect(result.body.detail.makeChallenge).to.equal(testCaseData.expected.detail.makeChallenge);
                        expect(result.body.interviewStartDateTime).to.equal(testCaseData.expected.interviewStartDateTime);
                        expect(result.body.interviewExpiredDateTime).to.equal(testCaseData.expected.interviewExpiredDateTime);
                        expect(result.body.email).to.equal(testCaseData.expected.email);
                        expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                        d = new Date().toISOString();
                        currentTime = d.split('T');
                        responseDate = result.body.lastmoddatetime;
                        responseTime = responseDate.split('T');
                        expect(currentTime[0]).to.equal(responseTime[0]);
                        expect(result.body.questions.source).to.equal(testCaseData.expected.questions.source);
                        expect(result.body.questions.type).to.equal(testCaseData.expected.questions.type);
                        for (i = 0; i < testCaseData.input.questions.list.length; i = i + 1) {
                            expect(result.body.questions.list[i].question).to.equal(testCaseData.expected.questions.list[i].question);
                            expect(result.body.questions.list[i].answer).to.equal(testCaseData.expected.questions.list[i].answer);
                            expect(result.body.questions.list[i].time).to.equal(testCaseData.expected.questions.list[i].time);
                            expect(result.body.questions.list[i].questiontype).to.equal(testCaseData.expected.questions.list[i].questiontype);
                        }
                        for (i = 0; i < testCaseData.input.events.length; i = i + 1) {
                            expect(result.body.events[i]).to.equal(testCaseData.expected.events[i]);
                        }
                        for (i = 0; i < testCaseData.input.sendEmail.length; i = i + 1) {
                            expect(result.body.sendEmail[i].email).to.equal(testCaseData.expected.sendEmail[i].email);
                            expect(result.body.sendEmail[i].access.live).to.equal(testCaseData.expected.sendEmail[i].access.live);
                            expect(result.body.sendEmail[i].access.collaboration).to.equal(testCaseData.expected.sendEmail[i].access.collaboration);
                            expect(result.body.sendEmail[i].access.screenSharing).to.equal(testCaseData.expected.sendEmail[i].access.screenSharing);
                            expect(result.body.sendEmail[i].access.public).to.equal(testCaseData.expected.sendEmail[i].access.public);
                        }
                        for (i = 0; i < testCaseData.input.definition.length; i = i + 1) {
                            expect(result.body.defination.id).to.equal(testCaseData.defination.id);
                            expect(result.body.defination.name).to.equal(testCaseData.defination.name);
                        }
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
        /*  it("TEST_FOR_BASIC_PUT_EMPLOYER_INTERVIEWS_FOR_" + tokens[a].role, function () {
         var testCase = this.test.title, testCaseData = putData[testSuite][testCase];
         this.timeout(30000);
         response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
         headers: {'x-access-token': tokens[a].token},
         'Content-Type': 'application/json',
         json: true
         });
         if (tokens[a].role === "SUPER") {
         return response.then(function (result) {
         expect(result.response.statusCode).to.equal(200);
         expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
         expect(result.body.n).to.equal(testCaseData.expected.n);
         expect(result.body.nModified).to.equal(testCaseData.expected.nModified);
         expect(result.body.ok).to.equal(testCaseData.expected.ok);
         return chakram.get(url + '/' + dynamicId, {
         headers: {'x-access-token': tokens[a].token},
         json: true
         });
         }).then(function (getResult) {
         expect(getResult.response.statusCode).to.equal(200);
         expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
         expect(getResult.body).to.not.be.a('null');
         expect(getResult.body).to.not.be.an('undefined');
         expect(getResult.body.emp_id).to.equal(testCaseData.input.emp_id);
         expect(getResult.body.type).to.equal(testCaseData.input.type);
         expect(getResult.body.challengeId).to.equal(testCaseData.input.challengeId);
         for (i = 0; i < getResult.body.events.length; i = i + 1) {
         expect(getResult.body.events[i]).to.equal(testCaseData.input.events[i]);
         }
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
         it("TEST_FOR_BASIC_DELETE_FOR_" + tokens[a].role, function () {
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
         });*/

    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
