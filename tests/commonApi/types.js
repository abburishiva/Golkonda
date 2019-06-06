var chakram = require('chakram'),
    token = require('../tokens.js'),
    expect = chakram.expect,
    config = require('../../tests/config/config.json'),
    data = require('../../tests/data/data.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "common/types",
    tokens = token.tokens;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
describe('COMMON_TYPES', function () {
    var testSuite = this.title,
        testSuiteData = {}, i, dynamicId;
    this.timeout(30000);
    it("BASIC_GET_ALL", function () {
        this.timeout(30000);
        return chakram.get(url + '?limit=5').then(function (commonTypesResult) {
            expect(commonTypesResult.response.statusCode).to.equal(200);
            dynamicId = commonTypesResult.body[0].id;
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.not.be.null;
            expect(commonTypesResult.body).to.not.be.undefined;
            expect(commonTypesResult.body[0]).to.have.property('id');
            expect(commonTypesResult.body[0]).to.have.property('entityid');
            expect(commonTypesResult.body[0]).to.have.property('name');
            expect(commonTypesResult.body[0]).to.have.property('description');
            expect(commonTypesResult.body[0]).to.have.property('lastmoddatetime');
            var d = new Date(commonTypesResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("GET_ALL_SORTING", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5&sort=entityid').then(function (commonTypesResult) {
            var  verify = true, finalResult, result;
            expect(commonTypesResult.response.statusCode).to.equal(200);
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.not.be.null;
            expect(commonTypesResult.body).to.not.be.undefined;
            if (commonTypesResult.body.length) {
                var entityidArray = commonTypesResult.body.map(function (item) {
                    return item.entityid;
                });

                function compareEntityId(currentEntityId, nextEntityId) {
                    return currentEntityId <= nextEntityId;
                }

                for (i = 0; i < entityidArray.length - 1; i++) {
                    entity(i);
                }
                function entity(k) {
                    result = compareEntityId(entityidArray[k], entityidArray[k + 1]);
                    expect(commonTypesResult.body).to.not.be.a('null');
                    expect(commonTypesResult.body).to.not.be.an('undefined');
                    expect(!commonTypesResult.body[k].id).to.be.false;
                    expect(!commonTypesResult.body[k].entityid).to.be.false;
                    expect(!commonTypesResult.body[k].name).to.be.false;
                    expect(!commonTypesResult.body[k].display_name).to.be.false;
                    expect(!commonTypesResult.body[k].lastmoduserid).to.be.false;
                    expect(!commonTypesResult.body[k].lastmoddatetime).to.be.false;
                    expect(result).to.be.true;
                }
                if (verify) {
                    finalResult = compareEntityId(2, 1);
                    expect(finalResult).to.be.false;
                }
            }
        });
    });
    it("GET_ALL_FILTERING_BY_ENTITY", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '?limit=5&entityid=' + testCaseData.input.entityid).then(function (commonTypesResult) {
            expect(commonTypesResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.not.be.null;
            expect(commonTypesResult.body).to.not.be.undefined;
            expect(commonTypesResult.body).to.be.instanceof(Array);
            for (i = 0; i < commonTypesResult.body.length; i = i + 1) {
                expect(commonTypesResult.body[i]).to.have.property('id');
                expect(commonTypesResult.body[i]).to.have.property('entityid', testCaseData.input.entityid);
                expect(commonTypesResult.body[i]).to.have.property('name');
                expect(commonTypesResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ALL_FILTERING_BY_NAME", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url +'?limit=5&name=' + testCaseData.input.name).then(function (commonTypesResult) {
            expect(commonTypesResult.response.statusCode).to.equal(200);
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.not.be.null;
            expect(commonTypesResult.body).to.not.be.undefined;
            expect(commonTypesResult.body.length).to.equal(testCaseData.expected.count);
            for (i = 0; i < commonTypesResult.body.length; i = i + 1) {
                expect(commonTypesResult.body[i]).to.have.property('id');
                expect(commonTypesResult.body[i]).to.have.property('entityid');
                expect(commonTypesResult.body[i]).to.have.property('name', testCaseData.input.name);
                expect(commonTypesResult.body[i]).to.have.property('description');
            }
        });
    });
    it("GET_ALL_FILTERING_AND_SORT", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url +'?limit=5&sort=' + testCaseData.input.sort + '&entityid=' + testCaseData.input.entityid).then(function (commonTypesResult) {
            expect(commonTypesResult.response.statusCode).to.equal(200);
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.not.be.null;
            expect(commonTypesResult.body).to.not.be.undefined;
            expect(commonTypesResult.body).to.be.instanceof(Array);

            var verify = true,result, testResult,idArray = commonTypesResult.body.map(function (item) {
                return item.id;
            });
            function compareId(currentId, nextId) {
                return currentId <= nextId;
            }
            function commonTypes(k) {
                result = compareId(idArray[k], idArray[k + 1]);
                expect(commonTypesResult.body[k]).to.have.property('id');
                expect(commonTypesResult.body[k]).to.have.property('entityid', testCaseData.input.entityid);
                expect(commonTypesResult.body[k]).to.have.property('name');
                expect(!commonTypesResult.body[k].display_name).to.be.false;
                expect(commonTypesResult.body[k]).to.have.property('description');
            }
            for (i = 0; i < idArray.length; i = i + 1) {
                commonTypes(i);
            }
            if (verify) {
                testResult = compareId(2, 1);
                expect(testResult).to.be.false;
            }
        });
    });
    it("GET_ONE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId).then(function (commonTypesResult) {
            expect(commonTypesResult.response.statusCode).to.equal(200);
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.have.property('id', dynamicId);
            expect(!commonTypesResult.body.entityid).to.be.false;
            expect(!commonTypesResult.body.name).to.be.false;
            expect(!commonTypesResult.body.display_name).to.be.false;
            expect(!commonTypesResult.body.description).to.be.false;
        });
    });
    it("GET_ONE_TYPE_ALL", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + dynamicId + '?type=all').then(function (commonTypesResult) {
            expect(commonTypesResult.response.statusCode).to.equal(200);
            expect(commonTypesResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonTypesResult.body).to.not.be.null;
            expect(commonTypesResult.body).to.not.be.undefined;
            expect(commonTypesResult.body).to.have.property('id', testCaseData.input.id);
            expect(commonTypesResult.body).to.have.property('name', testCaseData.expected.name);
            expect(commonTypesResult.body).to.have.property('common_entity').to.be.an('object');
            expect(commonTypesResult.body.common_entity).to.have.property('id');
            expect(commonTypesResult.body.common_entity).to.have.property('name');
            expect(commonTypesResult.body.common_entity).to.have.property('description');


        });
    });

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
    function execute(index) {
        it("TEST_FOR_BASIC_POST_" + tokens[index].role , function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase],
                response;
            this.timeout(30000);
            response = chakram.post(url, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[index].token}, json: true
            });
            if (tokens[index].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(201);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(postedData.body).to.have.property('entityid', testCaseData.input.payload.entityid);
                    expect(postedData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(postedData.body).to.have.property('description', testCaseData.input.payload.description);
                    testSuiteData.dynamicId = postedData.body.id;
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getData.body).to.have.property('entityid', testCaseData.input.payload.entityid);
                    expect(getData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getData.body).to.have.property('description', testCaseData.input.payload.description);
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
        it("TEST_FOR_BASIC_PUT_" + tokens[index].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.put(url + '/' + testSuiteData.dynamicId, testCaseData.input.payload, {
                headers: {'x-access-token': tokens[index].token},
                json: true
            });
            if (tokens[index].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(200);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(postedData.body).to.have.property('entityid', testCaseData.input.payload.entityid);
                    expect(postedData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(postedData.body).to.have.property('description', testCaseData.input.payload.description);
                    return chakram.get(url + '/' + testSuiteData.dynamicId);
                }).then(function (getData) {
                    expect(getData.response.statusCode).to.equal(200);
                    expect(getData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(getData.body).to.not.be.null;
                    expect(getData.body).to.not.be.undefined;
                    expect(getData.body).to.have.property('id', testSuiteData.dynamicId);
                    expect(getData.body).to.have.property('entityid', testCaseData.input.payload.entityid);
                    expect(getData.body).to.have.property('name', testCaseData.input.payload.name);
                    expect(getData.body).to.have.property('description', testCaseData.input.payload.description);
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
        it("TEST_FOR_BASIC_DELETE_" + tokens[index].role, function () {
            this.timeout(30000);
            return chakram.delete(url + '/' + testSuiteData.dynamicId, null, {
                headers: {'x-access-token': tokens[index].token}, json: false
            }).then(function (Result) {
                if (tokens[index].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + testSuiteData.dynamicId, null, {
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
