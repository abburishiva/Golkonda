var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    data = require('./data/compilerData.json'),
    url = baseUrl + 'compiler',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("COMPILER", function () {
    var testSuit = this.title, response, i, dynamicId;
    it("TEST_FOR_BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuit][testCase];
        this.timeout(30000);
        return chakram.get(url).then(function (compilerResult) {
            expect(compilerResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
            expect(compilerResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(compilerResult.body).to.not.be.null;
            expect(compilerResult.body).to.not.be.undefined;
            dynamicId = compilerResult.body[0].id;
            function compiler(k) {
                expect(compilerResult.body[k]).to.have.property('id');
                expect(compilerResult.body[k]).to.have.property('subjectid');
                expect(compilerResult.body[k]).to.have.property('compilerid');
                expect(compilerResult.body[k]).to.have.property('compiler_required');
                expect(compilerResult.body[k]).to.have.property('lastmoddatetime');
                expect(compilerResult.body[k]).to.have.property('lastmoduserid');
                var d = new Date(compilerResult.body[k].lastmoddatetime);
                expect(d.constructor.name).to.equal('Date');
            }
            for (i = 0; i < compilerResult.body.length; i = i + 1) {
                compiler(i);
            }

        });
    });
    it("TEST_FOR_GET_BY_ID", function () {
        var testCase = this.test.title, testCaseData = data[testSuit][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId).then(function (compilerResult) {
            expect(compilerResult.response.statusCode).to.equal(200);
            expect(compilerResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(compilerResult.body).to.not.be.null;
            expect(compilerResult.body).to.not.be.undefined;
        });
    });
    it("TEST_FOR_COMPILING_CODE_FOR_JAVASCRIPT", function () {
        var testCase = this.test.title, testCaseData = data[testSuit][testCase];
        this.timeout(30000);
        response = chakram.post(url + '/processes', testCaseData.input, {
            json: true
        });
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.Result).to.equal(testCaseData.expected.Result);
        });
    });
    it("TEST_FOR_COMPILING_CODE_FOR_JAVA", function () {
        var testCase = this.test.title, testCaseData = data[testSuit][testCase];
        this.timeout(30000);
        response = chakram.post(url + '/processes', testCaseData.input, {
            json: true
        });
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.Result).to.equal(testCaseData.expected.Result);
        });
    });
    it("TEST_FOR_COMPILING_CODE_FOR_NODEJS", function () {
        var testCase = this.test.title, testCaseData = data[testSuit][testCase];
        this.timeout(30000);
        response = chakram.post(url + '/processes', testCaseData.input, {
            json: true
        });
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.Result).to.equal(testCaseData.expected.Result);
        });
    });
    it("TEST_FOR_COMPILING_CODE_FOR_C#", function () {
        var testCase = this.test.title, testCaseData = data[testSuit][testCase];
        this.timeout(30000);
        response = chakram.post(url + '/processes', testCaseData.input, {
            json: true
        });
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "text/html; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
            expect(result.body.Result).to.equal(testCaseData.expected.Result);
        });
    });
    function execute(a) {
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuit][testCase];
            this.timeout(30000);
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (result) {
                    expect(result.response.statusCode).to.equal(201);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.body.id).to.equal(testCaseData.expected.id);
                    expect(result.body.compilerid).to.be.equal(testCaseData.input.compilerid);
                    expect(!result.body.subjectid).to.be.false;
                    var data = chakram.get(url + '?' + "compilerid=" + testCaseData.input.compilerid, {
                        headers: {'x-access-token': tokens[a].token},
                        json: true
                    });
                    return data.then(function (compilerresult) {
                        expect(compilerresult.response.statusCode).to.equal(200);
                        dynamicId = compilerresult.body[0].id;
                    });
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
        it("TEST_FOR_DELETE_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuit][testCase];
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

