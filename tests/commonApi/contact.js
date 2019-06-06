/*
/!*global process,describe,it,execute,i*!/
var chakram = require('chakram'),
    tokens = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../../tests/config/config.json'),
    data = require('../../tests/data/data.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/contacts",
    i,
    dynamicId,
    tokens = tokens.tokens;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
describe("COMMON_CONTACT", function () {
    var testSuite = this.title,
        testSuiteData = {};
    it("BASIC_GET_ALL", function () {
        this.timeout(30000);
        return chakram.get(url).then(function (commonContactResult) {
            expect(commonContactResult.response.statusCode).to.equal(200);
            expect(commonContactResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonContactResult.body).to.not.be.null;
            expect(commonContactResult.body).to.not.be.undefined;
            expect(commonContactResult.body[0]).to.have.property('id');
            expect(commonContactResult.body[0]).to.have.property('firstname');
            expect(commonContactResult.body[0]).to.have.property('lastname');
            expect(commonContactResult.body[0]).to.have.property('middlename');
            expect(commonContactResult.body[0]).to.have.property('email');
            expect(commonContactResult.body[0]).to.have.property('phone');
            expect(commonContactResult.body[0]).to.have.property('addressid');
            var d = new Date(commonContactResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?sort=id').then(function (commonContactResult) {
            var count = commonContactResult.body.length;
            expect(commonContactResult.response.statusCode).to.equal(200);
            expect(commonContactResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonContactResult.body).to.not.be.null;
            expect(commonContactResult.body).to.not.be.undefined;
            expect(commonContactResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(commonContactResult.body[0]).to.have.property('firstname', testCaseData.expected.first.firstname);
            expect(commonContactResult.body[0]).to.have.property('lastname', testCaseData.expected.first.lastname);
            expect(commonContactResult.body[0]).to.have.property('middlename', testCaseData.expected.first.middlename);
            expect(commonContactResult.body[0]).to.have.property('email', testCaseData.expected.first.email);
            expect(commonContactResult.body[count - 1]).to.have.property('id');
            expect(commonContactResult.body[count - 1]).to.have.property('firstname');
        });
    });
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], i;
        return chakram.get(url + "?firstname=" + testCaseData.input.firstname).then(function (commonContactResult) {
            expect(commonContactResult.response.statusCode).to.equal(200);
            expect(commonContactResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonContactResult.body).to.not.be.null;
            expect(commonContactResult.body).to.not.be.undefined;
            expect(commonContactResult.body).to.be.instanceof(Array);
            expect(commonContactResult.body.length).to.be.above(testCaseData.expected.count);
            for (i = 0; i < commonContactResult.body.length; i = i + 1) {
                expect(commonContactResult.body[i]).to.have.property('id');
                expect(commonContactResult.body[i]).to.have.property('firstname');
                expect(commonContactResult.body[i]).to.have.property('lastname');
                expect(commonContactResult.body[i]).to.have.property('middlename');
                expect(commonContactResult.body[i]).to.have.property('email');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], i, count;
        return chakram.get(url + "?sort=" + testCaseData.input.sort + '&firstname=' + testCaseData.input.firstname).then(function (commonContactResult) {
            expect(commonContactResult.response.statusCode).to.equal(200);
            expect(commonContactResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonContactResult.body).to.not.be.null;
            expect(commonContactResult.body).to.not.be.undefined;
            expect(commonContactResult.body).to.be.instanceof(Array);
            count = commonContactResult.body.length;
            expect(commonContactResult.body.length).to.be.above(testCaseData.expected.count);
            expect(commonContactResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(commonContactResult.body[0]).to.have.property('firstname');
            expect(commonContactResult.body[0]).to.have.property('lastname');
            expect(commonContactResult.body[0]).to.have.property('middlename');
            expect(commonContactResult.body[0]).to.have.property('email');
            expect(commonContactResult.body[0]).to.have.property('phone');
            expect(commonContactResult.body[count - 1]).to.have.property('id');
            expect(commonContactResult.body[count - 1]).to.have.property('firstname');
            for (i = 0; i < commonContactResult.body.length; i = i + 1) {
                expect(commonContactResult.body[i]).to.have.property('id');
                expect(commonContactResult.body[i]).to.have.property('firstname', testCaseData.input.firstname);
                expect(commonContactResult.body[i]).to.have.property('lastname');
                expect(commonContactResult.body[i]).to.have.property('middlename');
                expect(commonContactResult.body[i]).to.have.property('email');
            }
        });
    });
    it("GET_ONE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase],
            id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (commonContactResult) {
            expect(commonContactResult.response.statusCode).to.equal(200);
            expect(commonContactResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonContactResult.body).to.not.be.null;
            expect(commonContactResult.body).to.not.be.undefined;
            expect(commonContactResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonContactResult.body).to.have.property('firstname', testCaseData.expected.firstname);
            expect(commonContactResult.body).to.have.property('lastname', testCaseData.expected.lastname);
            expect(commonContactResult.body).to.have.property('middlename', testCaseData.expected.middlename);
            expect(commonContactResult.body).to.have.property('email', testCaseData.expected.email);
            expect(commonContactResult.body).to.have.property('phone', testCaseData.expected.phone);
            expect(commonContactResult.body).to.have.property('addressid', testCaseData.expected.addressid);
        });
    });
    it("GET_ONE_TYPE_ALL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase],
            id = testCaseData.input.id;
        return chakram.get(url + '/' + id + '?type=all').then(function (commonContactResult) {
            expect(commonContactResult.response.statusCode).to.equal(200);
            expect(commonContactResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonContactResult.body).to.not.be.null;
            expect(commonContactResult.body).to.not.be.undefined;
            expect(commonContactResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonContactResult.body.common_address).to.have.property('id', testCaseData.expected.common_address.id);
            expect(commonContactResult.body.common_address).to.have.property('address1', testCaseData.expected.common_address.address1);
            expect(commonContactResult.body).to.have.property('middlename', testCaseData.expected.middlename);
            expect(commonContactResult.body).to.have.property('email', testCaseData.expected.email);
            expect(commonContactResult.body).to.have.property('phone', testCaseData.expected.phone);
        });
    });
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
    function execute(index) {
        it("BASIC_POST_" + tokens[index].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
                response = chakram.post(url, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[index].token},
                    json: true
                });
            if (tokens[index].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(201);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(postedData.body).to.have.property('firstname', testCaseData.input.payload.firstname);
                    expect(postedData.body).to.have.property('lastname', testCaseData.input.payload.lastname);
                    expect(postedData.body).to.have.property('middlename', testCaseData.input.payload.middlename);
                    expect(postedData.body).to.have.property('email', testCaseData.input.payload.email);
                    dynamicId = postedData.body.id;
                    return chakram.get(url + '/' + dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', dynamicId);
                    expect(getData.body).to.have.property('firstname', testCaseData.input.payload.firstname);
                    expect(getData.body).to.have.property('lastname', testCaseData.input.payload.lastname);
                    expect(getData.body).to.have.property('middlename', testCaseData.input.payload.middlename);
                    expect(getData.body).to.have.property('email', testCaseData.input.payload.email);
                });
            }
            else if (tokens[index].role === "EMPLOYEE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[index].role === "CANDIDATE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            }
            else if (tokens[index].role === "NEW_USER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(401);
                });
            }
        });
        it("BASIC_PUT_" + tokens[index].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                response = chakram.put(url + '/' + dynamicId, testCaseData.input.payload, {
                    headers: {'x-access-token': tokens[index].token},
                    json: true
                });
            if (tokens[index].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(200);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(postedData.body).to.have.property('firstname', testCaseData.input.payload.firstname);
                    expect(postedData.body).to.have.property('lastname', testCaseData.input.payload.lastname);
                    expect(postedData.body).to.have.property('middlename', testCaseData.input.payload.middlename);
                    expect(postedData.body).to.have.property('email', testCaseData.input.payload.email);
                    return chakram.get(url + '/' + dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', dynamicId);
                    expect(getData.body).to.have.property('firstname', testCaseData.input.payload.firstname);
                    expect(getData.body).to.have.property('lastname', testCaseData.input.payload.lastname);
                    expect(getData.body).to.have.property('middlename', testCaseData.input.payload.middlename);
                    expect(getData.body).to.have.property('email', testCaseData.input.payload.email);
                });
            }
            else if (tokens[index].role === "EMPLOYEE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                    //expect(postedData.body.error).toBe("Forbidden!");
                });
            }
            else if (tokens[index].role === "CANDIDATE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                    //expect(postedData.body.error).toBe("Forbidden!");
                });
            }
            else if (tokens[index].role === "NEW_USER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(401);
                    //expect(postedData.body.error).toBe("Not Authorized!");
                });
            }
        });

        it("BASIC_DELETE " + tokens[index].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + dynamicId, null, {
                headers: {'x-access-token': tokens[index].token},
                json: false
            }).then(function (Result) {
                if (tokens[index].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + dynamicId, null, {
                        headers: {'x-access-token': tokens[index].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[index].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[index].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else if (tokens[index].role === "NEW_USER") {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
    }
});


*/

