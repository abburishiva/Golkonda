var chakram = require('chakram'),
    token = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../../tests/config/config.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/values",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("COMMON_VALUES", function () {
    var testSuite = this.title, response, i, dynamicId, d, currentTime, responseTime, responseDate;
    this.timeout(30000);
    describe("GET_CASES", function () {
        var getCases = this.title;
        it("GET_ALL_COMMON_VALUES", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url).then(function (commonValueResult) {
                expect(commonValueResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                expect(commonValueResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                expect(commonValueResult.body).to.not.be.a('null');
                expect(commonValueResult.body).to.not.be.an('undefined');
                dynamicId = commonValueResult.body[0].id;
                for (i = 0; i < testCaseData.expected.properties.length; i = i + 1) {
                    expect(commonValueResult.body[0]).hasOwnProperty(testCaseData.expected.properties[i]);
                }
            });
        });
        it("GET_COMMON_VALUE_WITH_VALID_ID", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url + '/' + dynamicId).then(function (result) {
                if (result.response.statusCode === testCaseData.expected.statusCode) {
                    expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                    expect(result.body).to.not.be.a('null');
                    expect(result.body).to.not.be.an('undefined');
                    expect(result.body.id).to.equal(dynamicId);
                }
                else if (result.response.statusCode === testCaseData.ifNoRecords.statusCode) {
                    expect(result.body.status).to.equal(testCaseData.ifNoRecords.status);
                    expect(result.body.message).to.equal(testCaseData.ifNoRecords.message);
                }
            });
        });
        it("GET_ALL_SORTING_BY_ENTITY_ID", function () {
            var verify = true, result, testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
            this.timeout(30000);
            return chakram.get(url + '?sort=entityid').then(function (commonValueResult) {
                if (commonValueResult.body.length) {
                    var entityidArray = commonValueResult.body.map(function (item) {
                        return item.entityid;
                    });

                    function compareEntityId(currentEntityId, nextEntityId) {
                        return currentEntityId <= nextEntityId;
                    }

                    for (i = 0; i < entityidArray.length - 1; i++) {
                        result = compareEntityId(entityidArray[i], entityidArray[i + 1]);
                        expect(commonValueResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(commonValueResult.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(commonValueResult.body).to.not.be.a('null');
                        expect(commonValueResult.body).to.not.be.an('undefined');
                        expect(result).to.be.true;
                    }
                    if (verify) {
                        result = compareEntityId(2, 1);
                        expect(result).to.be.false;
                    }
                }
            });
        });
    });
    function execute(i) {
        describe("POST_COMMON_VALUE", function () {
            var postCases = this.title;
            it("WITH_VALID_DATA_BY_" + tokens[i].role, function () {
                this.timeout(30000);
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + postCases + '.json'), testCaseData = data[postCases][testCase];
                response = chakram.post(url, testCaseData.input, {
                    headers: {'x-access-token': tokens[i].token},
                    json: true
                });
                if (tokens[i].role === "SUPER") {
                    return response.then(function (postedData) {
                        expect(postedData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(postedData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(postedData.body).to.have.property('audio', testCaseData.input.audio);
                        expect(postedData.body).to.have.property('video', testCaseData.input.video);
                        expect(postedData.body).to.have.property('periodlevel', testCaseData.input.periodlevel);
                        expect(postedData.body).to.have.property('entityid', testCaseData.input.entityid);
                        dynamicId = postedData.body.id;
                        d = new Date().toISOString();
                        currentTime = d.split('T');
                        return chakram.get(url + '/' + dynamicId);
                    }).then(function (getData) {
                        responseDate = getData.body.lastmoddatetime;
                        expect(getData.response.statusCode).to.equal(200);
                        expect(getData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getData.body.id).to.equal(dynamicId);
                        expect(getData.body.audio).to.equal(testCaseData.expected.audio);
                        expect(getData.body.video).to.equal(testCaseData.expected.video);
                        expect(getData.body.periodlevel).to.equal(testCaseData.expected.periodlevel);
                        expect(getData.body.entityid).to.equal(testCaseData.expected.entityid);
                        responseTime = responseDate.split('T');
                        expect(currentTime[0]).to.equal(responseTime[0]);
                    });
                } else if (tokens[i].role === "EMPLOYEE" || tokens[i].role === "CANDIDATE") {
                    return response.then(function (postedData) {
                        expect(postedData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[i].role === "NEW_USER") {
                    return response.then(function (postedData) {
                        expect(postedData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("UPDATE_COMMON_VALUE", function () {
            var putCases = this.title;
            it("WITH_VALID_DATA_BY_" + tokens[i].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + putCases + '.json'), testCaseData = data[putCases][testCase];
                this.timeout(30000);
                response = chakram.put(url + '/' + dynamicId, testCaseData.input, {
                    headers: {'x-access-token': tokens[i].token},
                    json: true
                });
                if (tokens[i].role === "SUPER") {
                    return response.then(function (postedData) {
                        expect(postedData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(postedData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(postedData.body).to.have.property('audio', testCaseData.input.audio);
                        expect(postedData.body).to.have.property('video', testCaseData.input.video);
                        d = new Date().toISOString();
                        currentTime = d.split('T');
                        return chakram.get(url + '/' + dynamicId);
                    }).then(function (getData) {
                        responseDate = getData.body.lastmoddatetime;
                        expect(getData.response.statusCode).to.equal(200);
                        expect(getData.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(getData.body).to.have.property('audio', testCaseData.input.audio);
                        expect(getData.body).to.have.property('video', testCaseData.input.video);
                        responseTime = responseDate.split('T');
                        expect(currentTime[0]).to.equal(responseTime[0]);
                    });
                } else if (tokens[i].role === "EMPLOYEE" || tokens[i].role === "CANDIDATE") {
                    return response.then(function (postedData) {
                        expect(postedData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[i].role === "NEW_USER") {
                    return response.then(function (postedData) {
                        expect(postedData.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("DELETE", function () {
            it("COMMON_VALUE_BY_" + tokens[i].role, function () {
                this.timeout(30000);
                return chakram.delete(url + '/' + dynamicId, null, {
                    headers: {'x-access-token': tokens[i].token},
                    json: false
                }).then(function (Result) {
                    if (tokens[i].role === "SUPER") {
                        expect(Result.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + dynamicId, null, {
                            headers: {'x-access-token': tokens[i].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    } else if (tokens[i].role === "EMPLOYEE" || tokens[i].role === "CANDIDATE") {
                        expect(Result.response.statusCode).to.equal(403);
                    } else if (tokens[i].role === "NEW_USER") {
                        expect(Result.response.statusCode).to.equal(401);
                    }
                });
            });
        })
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }

});
