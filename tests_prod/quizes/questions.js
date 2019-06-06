var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('../tokens'),
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    response,
    i,
    data = require('../data/data.json'),
    url = baseUrl + "questions",
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("QUESTIONS", function () {
    var testSuite = this.title,
        quizzes=data[testSuite],
        testSuiteData = {}, dynamicId,questiontype;
    it("TEST_FOR_BASIC_GET_ALL_QUESTIONS", function () {
        var testCase = this.test.title,
            testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url).then(function (questionResult) {
            expect(questionResult.response.statusCode).to.equal(200);
            expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(questionResult.body).to.not.be.null;
            expect(questionResult.body).to.not.be.undefined;
            expect(questionResult.body.length).to.greaterThan(testCaseData.expected.count);
            expect(questionResult.body[0]).to.have.property('id');
            expect(questionResult.body[0]).to.have.property('question');
            expect(questionResult.body[0]).to.have.property('subjectid');
            expect(questionResult.body[0]).to.have.property('levelid');
            dynamicId = questionResult.body[0].id;
            questiontype=questionResult.body[0].questiontype;
            var d = new Date(questionResult.body[0].lastmoddatetime);
            expect(d.constructor.name).to.equal('Date');
        });
    });
    it("TEST_FOR_GET_ONE", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url + '/' + dynamicId + "?questiontype=" + questiontype).then(function (questionResult) {
            expect(questionResult.response.statusCode).to.equal(200);
            expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(questionResult.body).to.not.be.null;
            expect(questionResult.body).to.not.be.undefined;
            expect(questionResult.body.id).to.be.equal(dynamicId);
            expect(!questionResult.body.subjectid).to.be.false;
            expect(!questionResult.body.levelid).to.be.false;
            expect(!questionResult.body.questiontype).to.be.false;
            expect(!questionResult.body.question).to.be.false;
        });
    });

    function execute(k) {
        it("TEST_FOR_GET_"+ quizzes.quizzes[k].toUpperCase()+"_QUESTIONS_FILTERING_BY_LEVELID", function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            return chakram.get(url + "?questiontype=" +quizzes.quizzes[k]+ "&levelid=" + testCaseData.input.levelid).then(function (questionResult) {
                expect(questionResult.response.statusCode).to.equal(200);
                expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(questionResult.body).to.not.be.null;
                expect(questionResult.body).to.not.be.undefined;
                expect(questionResult.body).to.be.instanceof(Array);
                expect(questionResult.body.length).to.greaterThan(testCaseData.expected.count);
                for (i = 0; i < questionResult.body.length; i = i + 1) {
                    expect(questionResult.body[i]).to.have.property('id');
                    expect(questionResult.body[i]).to.have.property('subjectid');
                    expect(questionResult.body[i]).to.have.property('levelid', testCaseData.input.levelid);
                    expect(questionResult.body[i]).to.have.property('question');
                }
            });
        });
        it("TEST_FOR_GET_"+ quizzes.quizzes[k].toUpperCase()+"_QUESTIONS_FILTERING_BY_SUBJECTID", function () {
            var testCase = this.test.title,
                testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            return chakram.get(url + "?questiontype=" +quizzes.quizzes[k]+ "&subjectid=" + testCaseData.input.subjectid).then(function (questionResult) {
                expect(questionResult.response.statusCode).to.equal(200);
                expect(questionResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(questionResult.body).to.not.be.null;
                expect(questionResult.body).to.not.be.undefined;
                expect(questionResult.body).to.be.instanceof(Array);
                for (i = 0; i < questionResult.body.length; i = i + 1) {
                    expect(questionResult.body[i]).to.have.property('id');
                    expect(questionResult.body[i]).to.have.property('subjectid', testCaseData.input.subjectid);
                    expect(questionResult.body[i]).to.have.property('levelid');
                }
            });
        });
    }

    for (i = 0; i < quizzes.quizzes.length; i = i + 1) {
        execute(i);
    }
});
