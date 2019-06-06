var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    ids = [],
    url = baseUrl + "cache/load",
    commonLevelsUrl = baseUrl + "common/levels",
    lookupCitiesUrl = baseUrl + "lookup/cities",
    subjectsUrl = baseUrl + "subjects",
    data = require('./data/cacheLoadRoutesData.json'),
    token = require('./tokens'),
    tokens = token.tokens;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("TEST_FOR_CACHE_LOAD_ROUTES", function () {
    var testSuite = this.title;
    this.timeout(30000);
    it("TEST_FOR_GET_ALL_COMMON_LEVELS_BY_FILTERING_AND_SORT", function () {
        var result,testResult, verify = true, testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(commonLevelsUrl + "?sort=entityid").then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            if (commonLevelResult.body.length) {
                var entityidArray = commonLevelResult.body.map(function (item) {
                    return item.entityid;
                });
                function entityId(currentEntityId, nextEntityId) {
                    return currentEntityId <= nextEntityId;
                }
                function sorting(b) {
                    result = entityId(entityidArray[b], entityidArray[b + 1]);
                    expect(commonLevelResult.response.statusCode).to.equal(200);
                    expect(commonLevelResult.response.headers['content-type']).to.equal("application/json; charset=utf-8");
                    expect(commonLevelResult.body).to.not.be.a('null');
                    expect(commonLevelResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                for (var a = 0; a < entityidArray.length - 1; a++) {
                    sorting(a);
                }
                if (verify) {                          // verify code is working or not
                    testResult = entityId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ALL_LOOKUP_CITIES_BY_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(lookupCitiesUrl + '?sort=name' + '&limit=50').then(function (cityResult) {
            var count = cityResult.body.length;
            expect(cityResult.response.statusCode).to.equal(200);
            expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(cityResult.body).to.not.be.null;
            expect(cityResult.body).to.not.be.undefined;
            expect(cityResult.body[0]).to.have.property('id', testCaseData.expected.first.id);
            expect(cityResult.body[0]).to.have.property('name', testCaseData.expected.first.name);
            expect(cityResult.body[0]).to.have.property('latitude');
            expect(cityResult.body[count - 1]).to.have.property('id');
            expect(cityResult.body[count - 1]).to.have.property('name');
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_FILTERING_WITH_CATEGORYID", function () {
        var testResult, result,verify = true, testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(subjectsUrl + "?categoryid=" + testCaseData.input.categoryid).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body).to.be.instanceof(Array);

            if (subjectData.body.length) {
                var categoryidArray = subjectData.body.map(function (item) {
                    return item.categoryid;
                });
                function entityId(currentEntityId, nextEntityId) {
                    return currentEntityId <= nextEntityId;
                }
                function filteringId(b) {
                    result = entityId(categoryidArray[b], categoryidArray[b + 1]);
                    expect(subjectData.response.statusCode).to.equal(200);
                    expect(subjectData.response.headers['content-type']).to.equal("application/json; charset=utf-8");
                    expect(subjectData.body).to.not.be.a('null');
                    expect(subjectData.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                for (var a = 0; a < categoryidArray.length - 1; a++) {
                    filteringId(a);
                }
                if (verify) {                          // verify code is working or not
                    testResult = entityId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
    function execute(a) {
        it("TEST_FOR_BASIC_POST_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            response = chakram.post(url, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            });
            if (tokens[a].role === "SUPER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(201);
                    expect(postedData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    for (i = 0; i < postedData.body.length; i = i + 1) {
                        ids[i] = postedData.body[i]._id;
                    }
                });
            } else if (tokens[a].role === "EMPLOYEE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "CANDIDATE") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(403);
                });
            } else if (tokens[a].role === "NEW_USER") {
                return response.then(function (postedData) {
                    expect(postedData.response.statusCode).to.equal(401);
                });
            }
        });
    }

    it("TEST_FOR_GET_ALL_ROUTES_IN_CACHE", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        response = chakram.get(url);
        return response.then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.null;
            expect(result.body).to.not.be.undefined;
        });
    });
    it("TEST_FOR_GET_ALL_COMMON_LEVELS_BY_FILTERING_AND_SORT", function () {
        var testResult, result,verify = true, testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(commonLevelsUrl + "?sort=entityid").then(function (commonLevelResult) {
            expect(commonLevelResult.response.statusCode).to.equal(200);
            expect(commonLevelResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(commonLevelResult.body).to.not.be.null;
            expect(commonLevelResult.body).to.not.be.undefined;
            expect(commonLevelResult.body).to.be.instanceof(Array);
            if (commonLevelResult.body.length) {
                var entityidArray = commonLevelResult.body.map(function (item) {
                    return item.entityid;
                });
                function entityId(currentEntityId, nextEntityId) {
                    return currentEntityId <= nextEntityId;
                }
                function sorting(b) {
                    result = entityId(entityidArray[b], entityidArray[b + 1]);
                    expect(commonLevelResult.response.statusCode).to.equal(200);
                    expect(commonLevelResult.response.headers['content-type']).to.equal('application/json; charset=utf-8');
                    expect(commonLevelResult.body).to.not.be.a('null');
                    expect(commonLevelResult.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                for (var a = 0; a < entityidArray.length - 1; a++) {
                    sorting(a);
                }
                if (verify) {                          // verify code is working or not
                    testResult = entityId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ALL_LOOKUP_CITIES_BY_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(lookupCitiesUrl + '?sort=name' + '&limit=50').then(function (cityResult) {
            var count = cityResult.body.length;
            expect(cityResult.response.statusCode).to.equal(200);
            expect(cityResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(cityResult.body).to.not.be.null;
            expect(cityResult.body).to.not.be.undefined
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_FILTERING_WITH_CATEGORYID", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(subjectsUrl + "?categoryid=" + testCaseData.input.categoryid).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body).to.be.instanceof(Array);
        });
    });
    for (i = 0; i < tokens.length; i = i + 1) {
        deleteCache(i);
    }
    function deleteCache(a) {
        it("TEST_FOR_DELETE_CACHE_ROUTES_FOR_COMMON_LEVELS_FOR_" + tokens[a].role, function () {
            return chakram.delete(url + '/' + ids[0], null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + ids[0], {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                }  else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
        it("TEST_FOR_DELETE_CACHE_ROUTES_FOR_LOOKUP_CITIES-FOR_" + tokens[a].role, function () {
            return chakram.delete(url + '/' + ids[1], null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + ids[1], {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                }  else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });
        it("TEST_FOR_DELETE_CACHE_ROUTES_FOR_SUBJECTS_FOR_" + tokens[a].role, function () {
            return chakram.delete(url + '/' + ids[2], null, {
                headers: {'x-access-token': tokens[a].token},
                json: false
            }).then(function (Result) {
                if (tokens[a].role === "SUPER") {
                    expect(Result.response.statusCode).to.equal(204);
                    return chakram.get(url + '/' + ids[2], {
                        headers: {'x-access-token': tokens[a].token},
                        json: false
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(404);
                    });
                } else if (tokens[a].role === "EMPLOYEE") {
                    expect(Result.response.statusCode).to.equal(403);
                }  else if (tokens[a].role === "CANDIDATE") {
                    expect(Result.response.statusCode).to.equal(403);
                } else {
                    expect(Result.response.statusCode).to.equal(401);
                }

            });
        });

    }
});