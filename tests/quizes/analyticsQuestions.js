var chakram = require("chakram"),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    url = baseUrl + "analytics_question",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUNTHORIZED = '0';
describe("ANALYTICS_QUESTIONS", function () {
    var testSuite = this.title, dynamicId;
    describe("ANALYTICS_QUESTIONS_GET", function () {
        var getCases = this.title;
        it("TEST_FOR_GET_ALL_ANALYTICS_QUESTIONS", function () {
            this.timeout(5000);
            return chakram.get(url).then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_AUDIO", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=audio").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CHOICE", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=choice").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CODING", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_TYPED", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }


                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_VIDEO", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });

        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_AUDIO_AND_CHOICE", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=audio,choice").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_AUDIO_AND_CODING", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=audio,coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_AUDIO_AND_TYPED", function () {

            this.timeout(90000);
            return chakram.get(url + "?questiontype=audio,typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_AUDIO_AND_VIDEO", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=audio,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });

        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CHOICE_AND_CODING", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=choice,coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CHOICE_AND_TYPED", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=choice,typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }


                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CHOICE_AND_VIDEO", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=choice,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CODING_AND_TYPED", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=coding,typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_CODING_AND_VIDEO", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=coding,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_TYPED_AND_VIDEO", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=typed,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_AUDIO_AND_CHOICE_AND_CODING", function () {
            this.timeout(90000);
            return chakram.get(url + "?questiontype=audio,choice,coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("subjectid");
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);

                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_SUBJECTID_VIDEO_AND_CODING", function () {
            this.timeout(15000);
            return chakram.get(url + "?questiontype=video,coding&subjectid=56").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i].subjectid).to.equal(56);
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_SUBJECTID_VIDEO_AND_CODING", function () {
            this.timeout(15000);
            return chakram.get(url + "?questiontype=video,coding&subjectid=56,2").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("questionid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_ANALYTICS_QUESTIONS_OF_SUBJECTID_VIDEO_AND_CODING", function () {
            this.timeout(15000);
            return chakram.get(url + "?questiontype=video,coding&subjectid=56,2,37").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(200);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function analyticsQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property("levelid");
                    expect(questionresult.body[i]).to.have.property("count");
                    expect(questionresult.body[i]).to.have.property("Highest_average_time");
                    expect(questionresult.body[i]).to.have.property("totaltime");
                    expect(questionresult.body[i]).to.have.property("review");
                    expect(questionresult.body[i]).to.have.property("questiontype");
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    analyticsQuestions(i);
                }
            });
        });

    });
});

