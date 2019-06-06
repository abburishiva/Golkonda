/*global process,describe,it,execute,i*/
/*jslint nomen: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    data = require('./data/employersQuestionsData.json'),
    url = baseUrl + 'employers_questions',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMPLOYERS_QUESTIONS", function () {
    var testSuite = this.title, dynamicId, response, currentTime, responseDate, lastmoddatetime, date, i;

    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_EMPLOYERS_QUESTIONS_FOR_" + tokens[a].role, function () {
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
        it("TEST_FOR_BASIC_GET_EMPLOYERS_QUESTIONS_BY_ID_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url + '/' + testCaseData.input.id, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    if (result.response.statusCode === 200) {
                        expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                        expect(result.body).to.not.be.a('null');
                        expect(result.body).to.not.be.an('undefined');
                        expect(result.body._id).to.equal(testCaseData.input.id);
                        expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                        expect(result.body.question).to.equal(testCaseData.expected.question);
                        expect(result.body.hint).to.equal(testCaseData.expected.hint);
                        expect(result.body.answer).to.equal(testCaseData.expected.answer);
                        expect(result.body.testcases).to.equal(testCaseData.expected.testcases);
                        expect(result.body.template).to.equal(testCaseData.expected.template);
                        expect(result.body.time).to.equal(testCaseData.expected.time);
                        expect(result.body.subject.subject_id).to.equal(testCaseData.expected.subject.subject_id);
                        expect(result.body.subject.category_id).to.equal(testCaseData.expected.subject.category_id);
                        expect(result.body.subject.description).to.equal(testCaseData.expected.subject.description);
                        expect(result.body.subject.name).to.equal(testCaseData.expected.subject.name);
                        expect(result.body.trimquestion).to.equal(testCaseData.expected.trimquestion);
                        for (i = 0; i < result.body.choice_options.length; i = i + 1) {
                            expect(result.body.choice_options[i]).to.equal(testCaseData.expected.choice_options[i]);
                        }
                    } else if (result.response.statusCode === 404) {
                        expect(result.body.no_records.status).to.equal(testCaseData.expected.no_records.status);
                        expect(result.body.no_records.message).to.equal(testCaseData.expected.no_records.message);
                    }
                });
            }
            else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                return response.then(function (result) {
                    expect(result.body.error.message).to.equal(testCaseData.expected.error.message);
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_POST_CHOICE_QUESTION_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(201);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body.question).to.equal(testCaseData.input.question);
                    expect(result.body.questiontype).to.equal(testCaseData.input.questiontype);
                    expect(result.body.emp_id).to.equal(testCaseData.input.emp_id);
                    expect(result.body.answer).to.equal(testCaseData.input.answer);
                    expect(result.body.time).to.equal(testCaseData.input.time);
                    expect(result.body.common_level.id).to.equal(testCaseData.input.common_level.id);
                    expect(result.body.common_level.name).to.equal(testCaseData.input.common_level.name);
                    expect(result.body.subject.name).to.equal(testCaseData.input.subject.name);
                    expect(result.body.choice_options[0].choice1).to.equal(testCaseData.input.choice_options[0].choice1);
                    expect(result.body.choice_options[0].choice2).to.equal(testCaseData.input.choice_options[0].choice2);
                    expect(result.body.choice_options[0].choice3).to.equal(testCaseData.input.choice_options[0].choice3);
                    expect(result.body.choice_options[0].choice4).to.equal(testCaseData.input.choice_options[0].choice4);
                    dynamicId = result.body._id;
                    date = new Date().toISOString();
                    currentTime = date.split('T');
                    responseDate = result.body.lastmoddatetime;
                    lastmoddatetime = responseDate.split('T');
                    expect(currentTime[0]).to.equal(lastmoddatetime[0]);
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
        it("TEST_FOR_BASIC_PUT_CHOICE_QUESTION_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");

                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.a('null');
                    expect(getResult.body).to.not.be.an('undefined');
                    expect(getResult.body.question).to.equal(testCaseData.input.question);
                    expect(getResult.body.questiontype).to.equal(testCaseData.input.questiontype);
                    expect(getResult.body.emp_id).to.equal(testCaseData.input.emp_id);
                    expect(getResult.body.answer).to.equal(testCaseData.input.answer);
                    expect(getResult.body.time).to.equal(testCaseData.input.time);
                    expect(getResult.body.common_level.id).to.equal(testCaseData.input.common_level.id);
                    expect(getResult.body.common_level.name).to.equal(testCaseData.input.common_level.name);
                    expect(getResult.body.subject.name).to.equal(testCaseData.input.subject.name);
                    expect(getResult.body.choice_options[0].choice1).to.equal(testCaseData.input.choice_options[0].choice1);
                    expect(getResult.body.choice_options[0].choice2).to.equal(testCaseData.input.choice_options[0].choice2);
                    expect(getResult.body.choice_options[0].choice3).to.equal(testCaseData.input.choice_options[0].choice3);
                    expect(getResult.body.choice_options[0].choice4).to.equal(testCaseData.input.choice_options[0].choice4);
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
        it("TEST_FOR_BASIC_DELETE_CHOICE_QUESTION_FOR_" + tokens[a].role, function () {
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
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
        it("TEST_FOR_BASIC_POST_CODING_QUESTION_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(201);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body.hint).to.equal(testCaseData.input.hint);
                    expect(result.body.question).to.equal(testCaseData.input.question);
                    expect(result.body.questiontype).to.equal(testCaseData.input.questiontype);
                    expect(result.body.template).to.equal(testCaseData.input.template);
                    expect(result.body.testcases).to.equal(testCaseData.input.testcases);
                    expect(result.body.time).to.equal(testCaseData.input.time);
                    expect(result.body.common_level.id).to.equal(testCaseData.input.common_level.id);
                    expect(result.body.subject.name).to.equal(testCaseData.input.subject.name);
                    expect(result.body.subject.subject_id).to.equal(testCaseData.input.subject.subject_id);
                    expect(result.body.subject.category_id).to.equal(testCaseData.input.subject.category_id);
                    dynamicId = result.body._id;
                    date = new Date().toISOString();
                    currentTime = date.split('T');
                    responseDate = result.body.lastmoddatetime;
                    lastmoddatetime = responseDate.split('T');
                    expect(currentTime[0]).to.equal(lastmoddatetime[0]);
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
        it("TEST_FOR_BASIC_PUT_CODING_QUESTION_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(40000);
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
                    expect(getResult.body.hint).to.equal(testCaseData.input.hint);
                    expect(getResult.body.question).to.equal(testCaseData.input.question);
                    expect(getResult.body.questiontype).to.equal(testCaseData.input.questiontype);
                    expect(getResult.body.template).to.equal(testCaseData.input.template);
                    expect(getResult.body.testcases).to.equal(testCaseData.input.testcases);
                    expect(getResult.body.time).to.equal(testCaseData.input.time);
                    expect(getResult.body.common_level.id).to.equal(testCaseData.input.common_level.id);
                    expect(getResult.body.subject.name).to.equal(testCaseData.input.subject.name);
                    expect(getResult.body.subject.subject_id).to.equal(testCaseData.input.subject.subject_id);
                    expect(getResult.body.subject.category_id).to.equal(testCaseData.input.subject.category_id);
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
        it("TEST_FOR_BASIC_DELETE_CODING_QUESTION_FOR_" + tokens[a].role, function () {
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
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
        it("TEST_FOR_BASIC_POST_VIDEO_QUESTION_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(201);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body.hint).to.equal(testCaseData.input.hint);
                    expect(result.body.question).to.equal(testCaseData.input.question);
                    expect(result.body.questiontype).to.equal(testCaseData.input.questiontype);
                    expect(result.body.template).to.equal(testCaseData.input.template);
                    expect(result.body.testcases).to.equal(testCaseData.input.testcases);
                    expect(result.body.time).to.equal(testCaseData.input.time);
                    expect(result.body.common_level.id).to.equal(testCaseData.input.common_level.id);
                    expect(result.body.subject.name).to.equal(testCaseData.input.subject.name);
                    expect(result.body.subject.subject_id).to.equal(testCaseData.input.subject.subject_id);
                    expect(result.body.subject.category_id).to.equal(testCaseData.input.subject.category_id);
                    dynamicId = result.body._id;
                    date = new Date().toISOString();
                    currentTime = date.split('T');
                    responseDate = result.body.lastmoddatetime;
                    lastmoddatetime = responseDate.split('T');
                    expect(currentTime[0]).to.equal(lastmoddatetime[0]);
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
        it("TEST_FOR_BASIC_PUT_VIDEO_QUESTION_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(40000);
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
                    expect(getResult.body.hint).to.equal(testCaseData.input.hint);
                    expect(getResult.body.question).to.equal(testCaseData.input.question);
                    expect(getResult.body.questiontype).to.equal(testCaseData.input.questiontype);
                    expect(getResult.body.template).to.equal(testCaseData.input.template);
                    expect(getResult.body.testcases).to.equal(testCaseData.input.testcases);
                    expect(getResult.body.time).to.equal(testCaseData.input.time);
                    expect(getResult.body.common_level.id).to.equal(testCaseData.input.common_level.id);
                    expect(getResult.body.subject.name).to.equal(testCaseData.input.subject.name);
                    expect(getResult.body.subject.subject_id).to.equal(testCaseData.input.subject.subject_id);
                    expect(getResult.body.subject.category_id).to.equal(testCaseData.input.subject.category_id);
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
        it("TEST_FOR_BASIC_DELETE_VIDEO_QUESTION_FOR_" + tokens[a].role, function () {
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
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
