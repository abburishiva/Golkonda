/*global process,describe,it,execute,i*/
var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    tokens = token.tokens,
    testSuiteData = {},
    data = require('../data/data.json'),
    url = baseUrl + "lookup/salaryunits";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("LOOKUP_EMPLOYEE_SALARY_UNITS", function () {
    var testSuite = this.title, i, testSuiteData = {};
    it("TEST_FOR_BASIC_GET_ALL", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url).then(function (employeeResult) {
            expect(employeeResult.response.statusCode).to.equal(400);
            expect(employeeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(employeeResult.body).to.not.be.null;
            expect(employeeResult.body).to.not.be.undefined;
        });
    });
    it("TEST_FOR_GET_ALL_SORTING", function () {
        var testCase = this.test.title,result,verify= true, tesResult, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '?limit=5&sort=id').then(function (employeeResult) {
            var count = employeeResult.body.length;
            if (employeeResult.body.length) {
                var idArray = employeeResult.body.map(function (item) {
                    return item.id;
                });

                function compareId(currentId, nextId) {
                    return currentId <= nextId;
                }

                for (i = 0; i < idArray.length - 1; i++) {
                    result = compareId(idArray[i], idArray[i + 1]);
                    expect(employeeResult.response.statusCode).to.equal(200);
                    expect(employeeResult.response.headers['content-type']).to.equal("application/json; charset=utf-8");
                    expect(employeeResult.body).to.not.be.a('null');
                    expect(employeeResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                if (verify) {
                    tesResult = compareId(2, 1);
                    expect(tesResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + "?limit=5&name=" + testCaseData.input.name).then(function (employeeResult) {
           if (employeeResult.response.statusCode === 200) {
               expect(employeeResult.response.statusCode).to.equal(200);
               expect(employeeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
               expect(employeeResult.body).to.not.be.null;
               expect(employeeResult.body).to.not.be.undefined;
               function filterResults(k) {
                   expect(employeeResult.body[k].name).to.be.equal(testCaseData.input.name);
                   expect(!employeeResult.body[k].id).to.be.false;
                   expect(!employeeResult.body[k].description).to.be.false;
                   expect(!employeeResult.body[k].symbol).to.be.false;
                   expect(!employeeResult.body[k].code).to.be.false;
                   expect(!employeeResult.body[k].lastmoduserid).to.be.false;
                   expect(!employeeResult.body[k].lastmoddatetime).to.be.false;
               }
               for (i =0; i < employeeResult.body.length; i++) {
                   filterResults(i);
               }
           } else {
               expect(employeeResult.response.statusCode).to.equal(404);
           }
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id;
        this.timeout(15000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (employeeResult) {
            expect(employeeResult.response.statusCode).to.equal(200);
            expect(employeeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(employeeResult.body).to.not.be.null;
            expect(employeeResult.body).to.not.be.undefined;
            expect(employeeResult.body).to.have.property('id', testCaseData.input.id);
            expect(employeeResult.body).to.have.property('name', testCaseData.expected.name);
            expect(employeeResult.body).to.have.property('description', testCaseData.expected.description);
        });
    });
    function execute(a) {
        it("TEST_FOR_BASIC_POST_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(20000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(201);
                    expect(employeeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(employeeResult.body).to.have.property('id');
                    expect(employeeResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(employeeResult.body).to.have.property("description", testCaseData.input.payload.description);
                    testSuiteData.dynamicId = employeeResult.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getRsult) {
                    expect(getRsult.response.statusCode).to.equal(200);
                    expect(getRsult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getRsult.body).to.have.property('id');
                    expect(getRsult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getRsult.body).to.have.property("description", testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_PUT_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(employeeResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(employeeResult.body).to.have.property('description', testCaseData.input.payload.description);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getResult) {
                    expect(getResult.response.statusCode).to.equal(200);
                    expect(getResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getResult.body).to.not.be.null;
                    expect(getResult.body).to.not.be.undefined;
                    expect(getResult.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getResult.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getResult.body).to.have.property('description', testCaseData.input.payload.description);
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (employeeResult) {
                    expect(employeeResult.response.statusCode).to.equal(401);
                });
            }
        });
        it("TEST_FOR_BASIC_DELETE_" + tokens[a].role, function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (employeeResult) {
                if (tokens[a].role === "SUPER") {
                    expect(employeeResult.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(employeeResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "CANDIDATE") {
                    expect(employeeResult.response.statusCode).to.equal(403);
                } else if (tokens[a].role === "NEW_USER") {
                    expect(employeeResult.response.statusCode).to.equal(401);
                }
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});
