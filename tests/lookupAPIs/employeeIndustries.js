var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "lookup/industries",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("EMPLOYEE_INDUSTRIES", function () {
    var testSuite = this.title, response, i, id;
    this.timeout(30000);
    describe("BASIC_GET_ALL", function () {
        var getCases = this.title;
        it("TEST_FOR_BASIC_GET_ALL_LOOKUP_INDUSTRIES", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'),
                testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url + '?limit=5').then(function (industriesResultData) {
                expect(industriesResultData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(industriesResultData.body).to.not.be.null;
                expect(industriesResultData.body).to.not.be.undefined;
                for (i = 0; i < industriesResultData.body; i++) {
                    expect(industriesResultData.body[i]).to.equal('id');
                    expect(industriesResultData.body[i]).to.equal('name');
                    expect(industriesResultData.body[i]).to.equal('flag');
                    expect(industriesResultData.body[i]).to.equal('description');
                    var d = new Date(industriesResultData.body[i].lastmoddatetime);
                    expect(d.constructor.name).to.equal('Date');
                }
            });
        });
        it("GET_ALL_SORTING", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'),
                testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url + '?limit=5&sort=name').then(function (industriesResultData) {
                var count = industriesResultData.body.length;
                expect(industriesResultData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(industriesResultData.body).to.not.be.null;
                expect(industriesResultData.body).to.not.be.undefined;
                for (i = 0; i < industriesResultData.body; i++) {
                    expect(industriesResultData.body[i]).to.equal('id', testCaseData.expected.first.id);
                    expect(industriesResultData.body[i]).to.equal('name', testCaseData.expected.first.name);
                    expect(industriesResultData.body[i]).to.equal('flag');
                    expect(industriesResultData.body[count - 1]).to.equal('id');
                    expect(industriesResultData.body[count - 1]).to.equal('name');
                }
            });
        });
        it("GET_ALL_FILTERING_BY_NAME", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'),
                testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (industriesResultData) {
                expect(industriesResultData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(industriesResultData.body).to.not.be.null;
                expect(industriesResultData.body).to.not.be.undefined;
                expect(industriesResultData.body.length).to.equal(testCaseData.expected.count);
                for (i = 0; i < industriesResultData.body.length; i = i + 1) {
                    expect(industriesResultData.body[i].id).to.equal(testCaseData.input.id);
                    expect(industriesResultData.body[i].name).to.equal(testCaseData.input.name);
                }
            });
        });
        it("GET_ALL_FILTERING_AND_SORT", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'),
                testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url + "?limit=5&sort=" + testCaseData.input.sort + '&name=' + testCaseData.input.name).then(function (industriesResultData) {
                expect(industriesResultData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(industriesResultData.body).to.not.be.null;
                expect(industriesResultData.body).to.not.be.undefined;
                expect(industriesResultData.body.length).to.equal(testCaseData.expected.count);
                for (i = 0; i < industriesResultData.body.length; i = i + 1) {
                    expect(industriesResultData.body[i].id).to.equal(testCaseData.expected.first.id);
                    expect(industriesResultData.body[i].name).to.equal(testCaseData.expected.first.name);
                }
            });
        });
        it("GET_ONE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'),
                testCaseData = data[getCases][testCase];
            this.timeout(30000);
            id = testCaseData.input.id;
            return chakram.get(url + '/' + id).then(function (industriesResultData) {
                expect(industriesResultData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(industriesResultData.body).to.not.be.null;
                expect(industriesResultData.body).to.not.be.undefined;
                expect(industriesResultData.body.id).to.equal(testCaseData.input.id);
                expect(industriesResultData.body.name).to.equal(testCaseData.expected.name);
                expect(industriesResultData.body.flag).to.equal(testCaseData.expected.flag);
            });
        });
    });

    function execute(a) {
        describe("BASIC_POST", function () {
            var postCases = this.title;
            it("TEST_FOR_BASIC_POST_LOOKUP_INDUSTRIES_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + postCases + '.json'),
                    testCaseData = data[postCases][testCase];
                this.timeout(30000);
                response = chakram.post(url, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                        expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.input.headers['content-type']);
                        expect(industriesResultData.body).to.have.property('id');
                        expect(industriesResultData.body.name).to.equal(testCaseData.input.payload.name);
                        expect(industriesResultData.body.flag).to.equal(testCaseData.input.payload.flag);
                        expect(industriesResultData.body.description).to.equal(testCaseData.input.payload.description);
                        id = industriesResultData.body.id;
                        return chakram.get(url + '/' + id);
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.have.property('id');
                        expect(getResult.body.name).to.equal(testCaseData.input.payload.name);
                        expect(getResult.body.flag).to.equal(testCaseData.input.payload.flag);
                        expect(getResult.body.description).to.equal(testCaseData.input.payload.description);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                    });
                }
            });
        });

        describe("BASIC_PUT", function () {
            var UpdateCases = this.title;
            it("TEST_FOR_BASIC_PUT_LOOKUP_INDUSTRIES_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + UpdateCases + '.json'),
                    testCaseData = data[UpdateCases][testCase];
                this.timeout(30000);

                response = chakram.put(url + '/' + id, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                        expect(industriesResultData.response.headers['content-type']).to.equal(testCaseData.input.headers['content-type']);
                        expect(industriesResultData.response.body.name).to.equal(testCaseData.input.payload.name);
                        expect(industriesResultData.response.body.flag).to.equal(testCaseData.input.payload.flag);
                        expect(industriesResultData.response.body.description).to.equal(testCaseData.input.payload.description);
                        return chakram.get(url + '/' + id);
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(getResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body).to.not.be.null;
                        expect(getResult.body).to.not.be.undefined;
                        expect(getResult.response.body).to.have.property('id');
                        expect(getResult.response.body.name).to.equal(testCaseData.input.payload.name);
                        expect(getResult.response.body.flag).to.equal(testCaseData.input.payload.flag);
                        expect(getResult.response.body.description).to.equal(testCaseData.input.payload.description);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                    });
                } else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                    });
                } else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (industriesResultData) {
                        expect(industriesResultData.response.statusCode).to.equal(testCaseData.input.statusCode);
                    });
                }
            });


            it("BASIC_DELETE_" + tokens[a].role, function () {
                this.timeout(30000);
                return chakram.delete(url + '/' + id, null, {
                    headers: {'x-access-token': tokens[a].token},
                    json: false
                }).then(function (industriesResultData) {
                    if (tokens[a].role === "super") {
                        expect(industriesResultData.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + id, null, {
                            headers: {'x-access-token': tokens[a].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    } else if (tokens[a].role === "employee") {
                        expect(industriesResultData.response.statusCode).to.equal(403);
                    } else if (tokens[a].role === "candidate") {
                        expect(industriesResultData.response.statusCode).to.equal(403);
                    } else if (tokens[a].role === "newUser") {
                        expect(industriesResultData.response.statusCode).to.equal(401);
                    }
                });
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }

});
