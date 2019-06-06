/*global process,describe,it,execute,i*/
/*jslint nomen: true */
var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    data = require('./data/employersSubjects.json'),
    url = baseUrl + 'employers_subjects',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMPLOYERS_SUBJECTS", function () {
    var testSuite = this.title, dynamicId, response, i;

    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_EMPLOYERS_SUBJECTS_FOR_" + tokens[a].role, function () {
            this.timeout(30000);
            response = chakram.get(url, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    if (result.body.length > 0) {
                        expect(result.body).to.not.be.a('null');
                        expect(result.body[0]).to.have.property('_id');
                        expect(result.body[0]).to.have.property('lastmoddatetime');
                        expect(result.body[0].category).to.have.property('id');
                        expect(result.body[0].category).to.have.property('name');
                        expect(result.body[0]).to.have.property('name');
                        expect(result.body[0]).to.have.property('lastmoduserid');
                    } else {
                        expect(result.body).to.not.be.an('undefined');
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
        it("TEST_FOR_BASIC_GET_EMPLOYERS_SUBJECTS_BY_ID_FOR_" + tokens[a].role, function () {
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
                        expect(result.body.name).to.equal(testCaseData.expected.name);
                        expect(result.body.description).to.equal(testCaseData.expected.description);
                        expect(result.body.category.id).to.equal(testCaseData.expected.category.id);
                        expect(result.body.category.name).to.equal(testCaseData.expected.category.name);
                        expect(result.body.category.description).to.equal(testCaseData.expected.category.description);
                        expect(result.body.codemirror_theme).to.equal(testCaseData.expected.codemirror_theme);
                    } else if (result.response.statusCode === 404) {
                        expect(result.body.status).to.equal(testCaseData.no_records.status);
                        expect(result.body.message).to.equal(testCaseData.no_records.message);
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
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
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
                    expect(result.body.emp_id).to.equal(testCaseData.expected.emp_id);
                    expect(result.body.name).to.equal(testCaseData.expected.name);
                    expect(result.body.description).to.equal(testCaseData.expected.description);
                    expect(result.body.template).to.equal(testCaseData.expected.template);
                    expect(result.body.category.id).to.equal(testCaseData.input.categoryid);
                    dynamicId = result.body._id;
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
        it("TEST_FOR_BASIC_PUT_FOR_" + tokens[a].role, function () {
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
                    expect(getResult.body.emp_id).to.equal(testCaseData.input.emp_id);
                    expect(getResult.body.name).to.equal(testCaseData.input.name);
                    expect(getResult.body.description).to.equal(testCaseData.input.description);
                    expect(getResult.body.template).to.equal(testCaseData.input.template);
                    expect(getResult.body.category.id).to.equal(testCaseData.input.categoryid);
                });
            }
            else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "CANDIDATE") {
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
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
