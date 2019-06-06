var chakram = require("chakram"),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    url = baseUrl + "questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUNTHORIZED = '0';
describe("MULTIPLE_QUESTIONS", function () {
    var testSuite = this.title, dynamicId;
  describe("MULTIPLE_QUESTIONS_GET", function () {
        var getCases = this.title;
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_AUDIO_AND_VIDEO", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Video)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_AUDIO_AND_CHOICE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,choice").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Choice)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            })
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_AUDIO_AND_CODING", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Coding)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            })
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_AUDIO_AND_TYPED", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Typed)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });

        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_AUDIO_AND_WHITEBOARD", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,whiteboard").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Whiteboard)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CHOICE_AND_CODING", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=choice,coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Choice|Coding)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CHOICE_AND_TYPED", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=choice,typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Choice|Typed)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CHOICE_AND_VIDEO", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=choice,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Choice|Video)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CHOICE_AND_WHITEBOARD", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=choice,whiteboard").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Choice|Whiteboard)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CODING_AND_TYPED", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=coding,typed").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Coding|Typed)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CODING_AND_VIDEO", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=coding,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Coding|Video)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_CODING_AND_WHITEBOARD", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=coding,whiteboard").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Coding|Whiteboard)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_TYPED_AND_VIDEO", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=typed,video").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Typed|Video)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });


        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_TYPED_AND_WHITEBOARD", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=typed,whiteboard").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Typed|Whiteboard)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_VIDEO_AND_WHITEBOARD", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=video,whiteboard").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Video|Whiteboard)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_AUDIO_AND_CHOICE_AND_CODING", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,choice,coding").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Choice|Coding)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_TYPED_AND_VIDEO_AND_WHITEBOARD", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(90000);
            return chakram.get(url + "?questiontype=typed,video,whiteboard").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.subjectid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Typed|Video|Whiteboard)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_SUBJECTID_AUDIO_AND_CHOICE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,choice&subjectid=56").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i].subjectid).to.equal(56);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Typed|Audio|Choice)$/);
                    expect(questionresult.body[i].subjectid).to.match(/^(Id|56)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_SUBJECTID_AUDIO_AND_CHOICE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,choice&subjectid=56,57").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Choice)$/);
                    expect(questionresult.body[i].subjectid).to.match(/^(56|57)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
        it("TEST_FOR_GET_MULTIPLE_QUESTIONS_OF_SUBJECTID_AUDIO_AND_CHOICE", function () {
            var testCase = this.test.title, data = require('../data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[testSuite][testCase];
            this.timeout(40000);
            return chakram.get(url + "?questiontype=audio,choice&subjectid=56,57,37").then(function (questionresult) {
                expect(questionresult.response.statusCode).to.equal(testCaseData.expected['statusCode']);
                expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                expect(questionresult.body).to.not.be.null;
                expect(questionresult.body).to.not.be.undefined;
                function multipleQuestions(i) {
                    expect(!questionresult.body[i].id).to.be.false;
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.question);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.levelid);
                    expect(questionresult.body[i]).to.have.property(testCaseData.expected.reviewDone);
                    expect(questionresult.body[i].questiontype).to.match(/^(Audio|Choice)$/);
                    expect(questionresult.body[i].subjectid).to.match(/^(56|37|57)$/);
                }

                for (i = 0; i < questionresult.body.length; i += 1) {
                    multipleQuestions(i);
                }
            });
        });
    })
    function execute(val) {
        describe("MULTIPLE_QUESTIONS_POST", function () {
            var postCases = this.title;
            it("TEST_FOR_BASIC_POST_MULTI_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + postCases + '.json'),
                    testCaseData = data[testSuite][testCase];
                this.timeout(40000);
                response = chakram.post(url + '?questiontype=video,typed', testCaseData.input, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (questionresult) {
                        expect(questionresult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(questionresult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(questionresult.body.id).to.be.instanceof(Array);
                        dynamicId = questionresult.body.id;
                        return chakram.get(url + '/' + dynamicId[0] + "?questiontype=video");
                    }).then(function (getoneResult) {
                        expect(getoneResult.response.statusCode).to.equal(200);
                        expect(getoneResult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(getoneResult.body.id).to.be.equal(dynamicId[0]);
                        expect(getoneResult.body.subjectid).to.equal(testCaseData.expected.subjectid);
                        expect(getoneResult.body.levelid).to.equal(testCaseData.expected.levelid);
                        expect(getoneResult.body.question).to.equal(testCaseData.expected.question);
                        expect(getoneResult.body.questiontype).to.equal("Video");
                        return chakram.get(url + '/' + dynamicId[1] + "?questiontype=typed");
                    }).then(function (gettwoResult) {
                        expect(gettwoResult.response.statusCode).to.equal(200);
                        expect(gettwoResult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(gettwoResult.body.id).to.be.equal(dynamicId[1]);
                        expect(gettwoResult.body.subjectid).to.equal(testCaseData.expected.subjectid);
                        expect(gettwoResult.body.levelid).to.equal(testCaseData.expected.levelid);
                        expect(gettwoResult.body.question).to.equal(testCaseData.expected.question);
                        expect(gettwoResult.body.questiontype).to.equal("Typed");
                    })
                } else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (questionResult) {
                        expect(questionResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (questionResult) {
                        expect(questionResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (videoResult) {
                        expect(videoResult.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("MULTIPLE_QUESTIONS_PUT", function () {
            var putCases = this.title;
            it("TEST_FOR_BASIC_PUT_VIDEO_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + putCases + '.json'),
                    testCaseData = data[testSuite][testCase];
                this.timeout(40000);
                response = chakram.put(url + '/' + dynamicId[0] + '?questiontype=video', testCaseData.input, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body.subjectid).to.equal(testCaseData.expected.subjectid);
                        expect(result.body.levelid).to.equal(testCaseData.expected.levelid);
                        expect(result.body.question).to.equal(testCaseData.expected.question);
                        return chakram.get(url + '/' + dynamicId[0] + '?questiontype=video');
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body.id).to.be.equal(dynamicId[0]);
                        expect(getResult.body.subjectid).to.equal(testCaseData.expected.subjectid);
                        expect(getResult.body.levelid).to.equal(testCaseData.expected.levelid);
                        expect(getResult.body.question).to.equal(testCaseData.expected.question);
                        expect(getResult.body.questiontype).to.equal("Video");
                    });
                } else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
            it("TEST_FOR_BASIC_PUT_TYPED_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + putCases + '.json'),
                    testCaseData = data[testSuite][testCase];
                this.timeout(40000);
                response = chakram.put(url + '/' + dynamicId[1] + '?questiontype=typed', testCaseData.input, {
                    headers: {'x-access-token': tokens[val].token},
                    json: true
                });
                if (tokens[val].role === "SUPER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(200);
                        expect(result.response.headers['content-type']).to.equal(testCaseData.expected.headers['content-type']);
                        expect(result.body.subjectid).to.equal(testCaseData.expected.subjectid);
                        expect(result.body.levelid).to.equal(testCaseData.expected.levelid);
                        expect(result.body.question).to.equal(testCaseData.expected.question);
                        return chakram.get(url + '/' + dynamicId[1] + '?questiontype=typed');
                    }).then(function (getResult) {
                        expect(getResult.response.statusCode).to.equal(200);
                        expect(getResult.response.headers["content-type"]).to.be.equal(testCaseData.expected.headers['content-type']);
                        expect(getResult.body.id).to.be.equal(dynamicId[1]);
                        expect(getResult.body.subjectid).to.equal(testCaseData.expected.subjectid);
                        expect(getResult.body.levelid).to.equal(testCaseData.expected.levelid);
                        expect(getResult.body.question).to.equal(testCaseData.expected.question);
                        expect(getResult.body.questiontype).to.equal("Typed");
                    });
                } else if (tokens[val].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[val].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                } else if (tokens[val].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
     describe("MULTIPLE_QUESTIONS_DELETE", function () {
            var deleteCases = this.title;
            it("TEST_FOR_BASIC_DELETE_TYPED_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + deleteCases + '.json'),
                    testCaseData = data[testSuite][testCase];
                this.timeout(40000);
                return chakram.delete(url + '/' + dynamicId[0] + '?questiontype=video', null, {
                    headers: {'x-access-token': tokens[val].token},
                    json: false
                }).then(function (result) {
                    if (tokens[val].role === "SUPER") {
                        expect(result.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + dynamicId[0] + '?questiontype=video',{
                            headers: {'x-access-token': tokens[val].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    } else if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    } else if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    } else if (tokens[val].role === "NEW_USER") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    }
                });
            });
            it("TEST_FOR_BASIC_DELETE_TYPED_QUESTIONS_FOR_" + tokens[val].role, function () {
                var testCase = this.test.title, data = require('../data/' + testSuite + '/' + deleteCases + '.json'),
                    testCaseData = data[testSuite][testCase];
                this.timeout(40000);
                return chakram.delete(url + '/' + dynamicId[1] + '?questiontype=typed', null, {
                    headers: {'x-access-token': tokens[val].token},
                    json: false
                }).then(function (result) {
                    if (tokens[val].role === "SUPER") {
                        expect(result.response.statusCode).to.equal(204);
                        return chakram.get(url + '/' + dynamicId[1] + '?questiontype=typed',{
                            headers: {'x-access-token': tokens[val].token},
                            json: false
                        }).then(function (getResult) {
                            expect(getResult.response.statusCode).to.equal(404);
                        });
                    } else if (tokens[val].role === "EMPLOYEE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    } else if (tokens[val].role === "CANDIDATE") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    } else if (tokens[val].role === "NEW_USER") {
                        return response.then(function (result) {
                            expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        });
                    }
                });
            });
        });
    }

    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
})
;











