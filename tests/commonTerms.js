var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    dynamicId,
    i,
    token = require('./tokens'),
    data = require('./data/commonTermsData.json'),
    url = baseUrl + 'common/terms',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("COMMON_TERMS", function () {
    var testSuite = this.title;
    it("TEST_FOR_BASIC_GET_ALL", function () {
        this.timeout(30000);
        response = chakram.get(url);
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body[0].id).hasOwnProperty('id');
            expect(result.body[0].name).hasOwnProperty('name');
            expect(result.body[0].description).hasOwnProperty('description');
            expect(result.body[0].lastmoduserid).hasOwnProperty('lastmoduserid');
        });
    });
    it("TEST_FOR_BASIC_GET_BY_ID", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        response = chakram.get(url + '/' + testCaseData.input.id);
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body.name).to.equal(testCaseData.expected.name);
            expect(result.body.description).to.equal(testCaseData.expected.description);
            expect(result.body.lastmoduserid).to.equal(testCaseData.expected.lastmoduserid);
        });
    });
    function execute(a) {
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                'Content-Type': 'application/json',
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(201);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body.name).to.equal(testCaseData.input.name);
                    expect(result.body.description).to.equal(testCaseData.input.description);
                    dynamicId = result.body.id;
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        'Content-Type': 'application/json',
                        json: true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body.name).to.equal(testCaseData.input.name);
                    expect(getResult.body.description).to.equal(testCaseData.input.description);
                    expect(!getResult.body.lastmoduserid).to.be.false;
                });
            }
            else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
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
                    expect(result.body.name).to.equal(testCaseData.input.name);
                    expect(result.body.description).to.equal(testCaseData.input.description);
                    return chakram.get(url + '/' + dynamicId, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body.name).to.equal(testCaseData.input.name);
                    expect(getResult.body.description).to.equal(testCaseData.input.description);
                });
            }
            else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[a].role === "NEW_USER") {
                return response.then(function (challengesResult) {
                    expect(challengesResult.response.statusCode).to.equal(401);
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
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                }
                else if (tokens[a].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }

});
