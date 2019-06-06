var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "subjects",
    routesDeletionUrl = baseUrl + "routes/deletion",
    data = require('./data/routesDeletionData.json'),
    token = require('./tokens'),
    tokens = token.tokens;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("TEST_FOR_ROUTES_DELETION_FOR_SUBJECTS_ROUTE", function () {
    var testSuite = this.title, response,
        i, Time, dynamicId, categoryId, verify = true;
    this.timeout(40000);
    for (i = 0; i < 1; i = i + 1) {
        it("TEST_FOR_GET_ALL_SUBJECTS", function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url).then(function (subjectsResult) {
                expect(subjectsResult.response.statusCode).to.equal(200);
                expect(subjectsResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(subjectsResult.body).to.not.be.null;
                expect(subjectsResult.body).to.not.be.undefined;
                dynamicId = subjectsResult.body[0].id;
                categoryId = subjectsResult.body[0].categoryid;
                var responseTime = require('response-time');
                Time = subjectsResult.responseTime;
            });
        });
        it("TEST_FOR_GET_SUBJECT_BY_ID", function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            response = chakram.get(url + '/' + dynamicId).then(function (subjectsResult) {
                expect(subjectsResult.response.statusCode).to.equal(200);
                expect(subjectsResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(subjectsResult.body).to.not.be.null;
                expect(subjectsResult.body).to.not.be.undefined;
                expect(result.body.id).to.equal(dynamicId);
                var responseTime = require('response-time');
                Time = subjectsResult.responseTime;
            });
        });
        it("TEST_FOR_GET_ALL_SUBJECTS_BY_SORTING", function () {
            var result, verify = true, testResult, testCase = this.test.title, testCaseData = data[testSuite][testCase], k;
            this.timeout(30000);
            return chakram.get(url + '?sort=id').then(function (subjectData) {
                count = subjectData.body.length;
                expect(subjectData.response.statusCode).to.equal(200);
                expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(subjectData.body).to.not.be.null;
                expect(subjectData.body).to.not.be.undefined;
                if (subjectData.body.length > 1) {
                    var subjectIdArray = subjectData.body.map(function (item) {
                        return item.id;
                    });

                    function compareSubjectId(currentId, nextId) {
                        return currentId <= nextId;
                    }

                    for (k = 0; k < subjectIdArray.length - 1; k++) {
                        result = compareSubjectId(subjectIdArray[k], subjectIdArray[k + 1]);
                        expect(subjectData.body).to.not.be.a('null');
                        expect(subjectData.body).to.not.be.an('undefined');
                        expect(result).to.be.true;
                    }
                    if (verify) {
                        testResult = compareSubjectId(2, 1);
                        expect(testResult).to.be.false;
                    }
                }
            });
        });
        it("TEST_FOR_GET_ALL_SUBJECTS_BY_FILTERING_AND_SORT", function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(30000);
            return chakram.get(url + "?sort=" + testCaseData.input.sort + '&categoryid=' + categoryId).then(function (subjectData) {
                expect(subjectData.response.statusCode).to.equal(200);
                expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(subjectData.body).to.not.be.null;
                expect(subjectData.body).to.not.be.undefined;
                expect(subjectData.body).to.be.instanceof(Array);
                expect(subjectData.body.length).to.greaterThan(testCaseData.expected.count);
                if (subjectData.body.length > 1) {
                    var subjectIdArray = subjectData.body.map(function (item) {
                        return item.categoryid;
                    });

                    function comparecategoryId(currentId, nextId) {
                        return currentId <= nextId;
                    }

                    for (k = 0; k < subjectIdArray.length - 1; k++) {
                        var result = comparecategoryId(subjectIdArray[k], subjectIdArray[k + 1]);
                        expect(subjectData.body).to.not.be.a('null');
                        expect(subjectData.body).to.not.be.an('undefined');
                        expect(result).to.be.true;
                    }
                    if (verify) {
                        var testResult = comparecategoryId(2, 1);
                        expect(testResult).to.be.false;
                    }
                }
            });
        });
    }
    function execute(a) {
        it("TEST_FOR_DELETE_ROUTE_FOR_GET_ALL_SUBJECTS_BY_SORTING_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            response = chakram.post(routesDeletionUrl, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            }).then(function (result) {
                if (tokens[a].role === "SUPER") {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.response.body.message).to.equal(testCaseData.expected.msg);
                } else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    expect(result.response.statusCode).to.equal(403);
                }
                else {
                    expect(result.response.statusCode).to.equal(401);

                }
            });
            chakram.wait();
        });
        it("TEST_FOR_DELETE_ROUTE_FOR_GET_SUBJECT_BY_ID_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            response = chakram.post(routesDeletionUrl, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            }).then(function (result) {
                if (tokens[a].role === "SUPER") {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.response.body.message).to.equal(testCaseData.expected.msg);
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    expect(result.response.statusCode).to.equal(403);
                }
                else {
                    expect(result.response.statusCode).to.equal(401);

                }
            });
            chakram.wait();
        });
        it("TEST_FOR_DELETE_ROUTE_FOR_GET_ALL_SUBJECTS_BY_FILTERING_AND_SORTING_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            response = chakram.post(routesDeletionUrl, testCaseData.input, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            }).then(function (result) {
                if (tokens[a].role === "SUPER") {
                    expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.response.body.message).to.equal(testCaseData.expected.msg);
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    expect(result.response.statusCode).to.equal(403);
                }
                else {
                    expect(result.response.statusCode).to.equal(401);
                }
            });
            chakram.wait();
        });
        it("TEST_FOR_DELETE_ROUTE_FOR_GET_ALL_SUBJECTS_FOR_" + tokens[a].role, function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            response = chakram.post(routesDeletionUrl, testCaseData.input).then(function (result) {
                if (tokens[a].role === "SUPER") {
                    expect(result.response.statusCode).to.equal(200);
                    expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(result.body).to.not.be.null;
                    expect(result.body).to.not.be.undefined;
                    expect(result.response.body.message).to.equal(testCaseData.expected.msg);
                }
                else if (tokens[a].role === "EMPLOYEE" || tokens[a].role === "CANDIDATE") {
                    expect(result.response.statusCode).to.equal(403);
                }
                else {
                    expect(result.response.statusCode).to.equal(401);
                }
            });
        });
    }

    it("TEST_FOR_GET_ALL_SUBJECTS", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(50000);
        response = chakram.get(url).then(function (subjectsResult) {
            var responseTime = require('response-time');
            if (subjectsResult.responseTime !== Time) {
                expect(subjectsResult.response.statusCode).to.equal(200);
                expect(subjectsResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(subjectsResult.body).to.not.be.null;
                expect(subjectsResult.body).to.not.be.undefined;
            }
        });
    });
    it("TEST_FOR_GET_SUBJECT_BY_ID", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        response = chakram.get(url + '/' + testCaseData.input.id).then(function (subjectsResult) {
            expect(subjectsResult.response.statusCode).to.equal(200);
            expect(subjectsResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectsResult.body).to.not.be.null;
            expect(subjectsResult.body).to.not.be.undefined;
            expect(result.body.id).to.equal(testCaseData.input.id);
            var responseTime = require('response-time');
            Time = subjectsResult.responseTime;
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_SORTING", function () {
        var verify = true, result, testResult, testCase = this.test.title, testCaseData = data[testSuite][testCase], count;
        this.timeout(30000);
        return chakram.get(url + '?sort=id').then(function (subjectData) {
            count = subjectData.body.length;
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            if (subjectData.body.length > 0) {
                var subjectIdArray = subjectData.body.map(function (item) {
                    return item.id;
                });

                function compareSubjectId(currentId, nextId) {
                    return currentId <= nextId;
                }

                for (k = 0; k < subjectIdArray.length - 1; k++) {
                    result = compareSubjectId(subjectIdArray[k], subjectIdArray[k + 1]);
                    expect(subjectData.body).to.not.be.a('null');
                    expect(subjectData.body).to.not.be.an('undefined');
                    expect(result).to.be.true;
                }
                if (verify) {
                    testResult = compareSubjectId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});