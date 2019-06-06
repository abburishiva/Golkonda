var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('../config/config.json'),
    baseUrl = config.mochaUrl,
    url = baseUrl + "app/quizzes/",
    quizzes = ['choice', 'audio', 'coding', 'typed', 'video', 'whiteboard'];
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("APP_QUIZZES", function () {
    var dynamicId = [], baseurl, i;

    function execute(i) {
        baseurl = null;
        it("TEST_FOR_BASIC_GET_" + quizzes[i].toUpperCase() + "_QUIZZES", function (done) {
            this.timeout(30000);
            baseurl = url + quizzes[i] + "/subjects/";
            chakram.get(url + quizzes[i] + "/subjects").then(function (result) {
                expect(result.response.statusCode).to.equal(200);
                expect(result.response.headers["content-type"]).to.be.equal('application/json; charset=utf-8');
                expect(result.body).to.not.be.null;
                expect(result.body).to.not.be.undefined;
                for (i = 0; i < result.body.length; i = i + 1) {
                    expect(!result.body[i].subjectId).to.be.false;
                    expect(!result.body[i].name).to.be.false;
                    expect(result.body[i].subjects_count).to.be.above(4);
                    dynamicId.push(result.body[i].subjectId);
                }
                function execute(val) {
                    chakram.get(baseurl + val + "/levels").then(function (result) {
                        for (i = 0; i < result.body.length; i = i + 1) {
                            expect(!result.body[i].levelId).to.be.false;
                            expect(!result.body[i].name).to.be.false;
                            expect(result.body[i].questions_count).to.be.above(4);
                        }
                    });
                }
                for (i = 0; i < dynamicId.length; i = i + 1) {
                    execute(dynamicId[i]);
                }
                dynamicId = [];
                setTimeout(done, 1000);
            });
        });
    }

    for (i = 0; i < quizzes.length; i = i + 1) {
        execute(i);
    }
});

