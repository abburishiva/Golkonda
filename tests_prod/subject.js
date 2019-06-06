var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('./tokens'),
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    data = require('./data/data.json'),
    url = baseUrl + "subjects",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("SUBJECT", function () {
    var testSuite = this.title, response,
        i, testSuiteData = {}, k, dynamicName, categoryId, verify = true, result, testResult;
    it("TEST_FOR_BASIC_GET_ALL_SUBJECTS", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body.length).to.greaterThan(testCaseData.expected.count);
            expect(subjectData.body[0]).to.have.property('id');
            expect(subjectData.body[0]).to.have.property('categoryid');
            expect(subjectData.body[0]).to.have.property('name');
            dynamicName = subjectData.body[0].name;
            categoryId = subjectData.body[0].categoryid;
            var d = new Date(subjectData.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_SORTING", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], count;
        this.timeout(30000);
        return chakram.get(url + '?sort=id').then(function (subjectData) {
            count = subjectData.body.length;
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            if (subjectData.body.length) {
                var subjectIdArray = subjectData.body.map(function (item) {
                    return item.id;
                });

                function compareSubjectId(currentId, nextId) {
                    return currentId <= nextId;
                }

                for (k = 0; k < subjectIdArray.length - 1; k++) {
                    result = compareSubjectId(subjectIdArray[k], subjectIdArray[k + 1]);
                    expect(!subjectData.body[k].id).to.be.false;
                    expect(!subjectData.body[k].categoryid).to.be.false;
                    expect(!subjectData.body[k].name).to.be.false;
                    expect(result).to.be.true;
                }
                if (verify) {
                    testResult = compareSubjectId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_FILTERING_WITH_NAME", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?name=" + dynamicName).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body).to.be.instanceof(Array);
            for (i = 0; i < subjectData.body[0].length; i = i + 1) {
                expect(!subjectData.body[0].id).to.be.false;
                expect(!subjectData.body[0].categoryid).to.be.fasle;
                expect(subjectData.body[0].name).to.equal(dynamicName);
                expect(!subjectData.body[0].icon_class).to.be.false;
                expect(!subjectData.body[0].description).to.be.false;
                expect(!subjectData.body[0].lastmoddatetime).to.be.false;
                expect(!subjectData.body[0].lastmoduserid).to.be.false;
            }
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_FILTERING_WITH_CATEGORYID", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?categoryid=" + categoryId).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body).to.be.instanceof(Array);

            if (subjectData.body.length) {
                var subjectCategoryIdIdArray = subjectData.body.map(function (item) {
                    return item.categoryid;
                });

                function compareSubjectId(currentCategoryId, nextCategoryId) {
                    return currentCategoryId <= nextCategoryId;
                }

                for (k = 0; k < subjectCategoryIdIdArray.length - 1; k++) {
                    result = compareSubjectId(subjectCategoryIdIdArray[k], subjectCategoryIdIdArray[k + 1]);
                    expect(!subjectData.body[k].id).to.be.false;
                    expect(!subjectData.body[k].categoryid).to.be.false;
                    expect(!subjectData.body[k].name).to.be.false;
                    expect(result).to.be.true;
                }
                if (verify) {
                    testResult = compareSubjectId(2, 1);
                    expect(testResult).to.be.false;
                }
            }
        });
    });
    it("TEST_FOR_GET_ONE_SUBJECT", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase], id;
        this.timeout(30000);
        id = testCaseData.input.id;
        return chakram.get(url + '/' + id).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body).to.have.property('id', testCaseData.input.id);
            expect(subjectData.body).to.have.property('categoryid', testCaseData.expected.categoryid);
            expect(subjectData.body).to.have.property('name', testCaseData.expected.name);
        });
    });
    it("TEST_FOR_GET_ALL_SUBJECTS_BY_FILTERING_AND_SORT", function () {
        var finalResult, testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + "?sort=" + testCaseData.input.sort + '&categoryid=' + testCaseData.input.categoryid).then(function (subjectData) {
            expect(subjectData.response.statusCode).to.equal(200);
            expect(subjectData.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(subjectData.body).to.not.be.null;
            expect(subjectData.body).to.not.be.undefined;
            expect(subjectData.body).to.be.instanceof(Array);
            expect(subjectData.body.length).to.greaterThan(testCaseData.expected.count);
            expect(subjectData.body[0]).to.have.property('categoryid');
            expect(subjectData.body[0]).to.have.property('name');
            if (subjectData.body.length > 1) {
                var categoryidArray = subjectData.body.map(function (item) {
                    return item.categoryid;
                });

                function compareCategoryId(categoryId, nextCategoryId) {
                    return categoryId <= nextCategoryId;
                }

                for (i = 0; i < categoryidArray.length - 1; i++) {
                    categoryId(i);
                }
                function categoryId(k) {
                    result = compareCategoryId(categoryidArray[k], categoryidArray[k + 1]);
                    expect(subjectData.body).to.not.be.a('null');
                    expect(subjectData.body).to.not.be.an('undefined');
                    expect(!subjectData.body[k].id).to.be.false;
                    expect(!subjectData.body[k].name).to.be.false;
                    expect(!subjectData.body[k].lastmoduserid).to.be.false;
                    expect(!subjectData.body[k].lastmoddatetime).to.be.false;
                    expect(result).to.be.true;
                }

                if (verify) {
                    finalResult = compareCategoryId(2, 1);
                    expect(finalResult).to.be.false;
                }
            }

        });
    });
    function execute(a) {
        if (tokens[a].role === "CANDIDATE") {
            it("TEST_FOR_GET_ALL_SUBJECTS_BY_PASSING_QUIZ_TYPE_AS_CHOICE", function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                return chakram.get(url + "?quiztype=" + testCaseData.input.quiz_type).then(function (subjectData) {
                    expect(subjectData.response.statusCode).to.equal(200);
                    function getLevels(subjectlevel) {
                        return chakram.get(url + '/' + subjectData.body[subjectlevel].subjectId + '/levels?quiztype=' + testCaseData.input.quiz_type).then(function (levelsData) {
                            expect(levelsData.response.statusCode).to.equal(200);
                            function getChallenges(challenges) {
                                return chakram.post(candidateChallengeUrl, {
                                    "subjectid": subjectData.body[subjectlevel].subjectId,
                                    "levelid": levelsData.body[challenges].levelId,
                                    "quiztype": testCaseData.input.quiz_type[type]
                                }, {
                                    headers: {'x-access-token': tokens[a].token}, json: true
                                }).then(function (challengesData) {
                                    expect(challengesData.response.statusCode).to.equal(201);
                                    expect(challengesData.body.questions.length).to.above(4);
                                });
                            }

                            for (var m = 0; m < levelsData.body.length; m++) {
                                getChallenges(m);
                            }
                        });
                    }

                    for (var l = 0; l < subjectData.body.length; l++) {
                        getLevels(l);
                    }
                });
            });
            it("TEST_FOR_GET_ALL_SUBJECTS_BY_PASSING_QUIZ_TYPE_AS_CODING", function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                return chakram.get(url + "?quiztype=" + testCaseData.input.quiz_type).then(function (subjectData) {
                    expect(subjectData.response.statusCode).to.equal(200);
                    function getLevels(subjectlevel) {
                        return chakram.get(url + '/' + subjectData.body[subjectlevel].subjectId + '/levels?quiztype=' + testCaseData.input.quiz_type).then(function (levelsData) {
                            expect(levelsData.response.statusCode).to.equal(200);
                            function getChallenges(challenges) {
                                return chakram.post(candidateChallengeUrl, {
                                    "subjectid": subjectData.body[subjectlevel].subjectId,
                                    "levelid": levelsData.body[challenges].levelId,
                                    "quiztype": testCaseData.input.quiz_type[type]
                                }, {
                                    headers: {'x-access-token': tokens[a].token}, json: true
                                }).then(function (challengesData) {
                                    expect(challengesData.response.statusCode).to.equal(201);
                                    expect(challengesData.body.questions.length).to.above(4);
                                });
                            }

                            for (var m = 0; m < levelsData.body.length; m++) {
                                getChallenges(m);
                            }
                        });
                    }

                    for (var l = 0; l < subjectData.body.length; l++) {
                        getLevels(l);
                    }
                });
            });
            it("TEST_FOR_GET_ALL_SUBJECTS_BY_PASSING_QUIZ_TYPE_AS_VIDEO", function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                return chakram.get(url + "?quiztype=" + testCaseData.input.quiz_type).then(function (subjectData) {
                    expect(subjectData.response.statusCode).to.equal(200);
                    function getLevels(subjectlevel) {
                        return chakram.get(url + '/' + subjectData.body[subjectlevel].subjectId + '/levels?quiztype=' + testCaseData.input.quiz_type).then(function (levelsData) {
                            expect(levelsData.response.statusCode).to.equal(200);
                            function getChallenges(challenges) {
                                return chakram.post(candidateChallengeUrl, {
                                    "subjectid": subjectData.body[subjectlevel].subjectId,
                                    "levelid": levelsData.body[challenges].levelId,
                                    "quiztype": testCaseData.input.quiz_type[type]
                                }, {
                                    headers: {'x-access-token': tokens[a].token}, json: true
                                }).then(function (challengesData) {
                                    expect(challengesData.response.statusCode).to.equal(201);
                                    expect(challengesData.body.questions.length).to.above(4);
                                });
                            }

                            for (var m = 0; m < levelsData.body.length; m++) {
                                getChallenges(m);
                            }
                        });
                    }

                    for (var l = 0; l < subjectData.body.length; l++) {
                        getLevels(l);
                    }
                });
            });
            it("TEST_FOR_GET_ALL_SUBJECTS_BY_PASSING_QUIZ_TYPE_AS_AUDIO", function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                return chakram.get(url + "?quiztype=" + testCaseData.input.quiz_type).then(function (subjectData) {
                    expect(subjectData.response.statusCode).to.equal(200);
                    function getLevels(subjectlevel) {
                        return chakram.get(url + '/' + subjectData.body[subjectlevel].subjectId + '/levels?quiztype=' + testCaseData.input.quiz_type).then(function (levelsData) {
                            expect(levelsData.response.statusCode).to.equal(200);
                            function getChallenges(challenges) {
                                return chakram.post(candidateChallengeUrl, {
                                    "subjectid": subjectData.body[subjectlevel].subjectId,
                                    "levelid": levelsData.body[challenges].levelId,
                                    "quiztype": testCaseData.input.quiz_type[type]
                                }, {
                                    headers: {'x-access-token': tokens[a].token}, json: true
                                }).then(function (challengesData) {
                                    expect(challengesData.response.statusCode).to.equal(201);
                                    expect(challengesData.body.questions.length).to.above(4);
                                });
                            }

                            for (var m = 0; m < levelsData.body.length; m++) {
                                getChallenges(m);
                            }
                        });
                    }

                    for (var l = 0; l < subjectData.body.length; l++) {
                        getLevels(l);
                    }
                });
            });
            it("TEST_FOR_GET_ALL_SUBJECTS_BY_PASSING_QUIZ_TYPE_AS_TYPED", function () {
                var testCase = this.test.title, testCaseData = data[testSuite][testCase];
                this.timeout(30000);
                return chakram.get(url + "?quiztype=" + testCaseData.input.quiz_type).then(function (subjectData) {
                    expect(subjectData.response.statusCode).to.equal(200);
                    function getLevels(subjectlevel) {
                        return chakram.get(url + '/' + subjectData.body[subjectlevel].subjectId + '/levels?quiztype=' + testCaseData.input.quiz_type).then(function (levelsData) {
                            expect(levelsData.response.statusCode).to.equal(200);
                            function getChallenges(challenges) {
                                return chakram.post(candidateChallengeUrl, {
                                    "subjectid": subjectData.body[subjectlevel].subjectId,
                                    "levelid": levelsData.body[challenges].levelId,
                                    "quiztype": testCaseData.input.quiz_type[type]
                                }, {
                                    headers: {'x-access-token': tokens[a].token}, json: true
                                }).then(function (challengesData) {
                                    expect(challengesData.response.statusCode).to.equal(201);
                                    expect(challengesData.body.questions.length).to.above(4);
                                });
                            }

                            for (var m = 0; m < levelsData.body.length; m++) {
                                getChallenges(m);
                            }
                        });
                    }

                    for (var l = 0; l < subjectData.body.length; l++) {
                        getLevels(l);
                    }
                });
            });
        }
    }
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});


