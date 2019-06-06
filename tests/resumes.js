var chakram = require('chakram'),
    expect = chakram.expect,
    token = require('./tokens'),
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    data = require('./data/resumeData.json'),
    dynamicId,
    i,
    url =  baseUrl   + 'resumes',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("RESUMES", function () {
    var testSuite = this.title;
    function execute(a) {
        it("TEST_FOR_BASIC_GET_ALL_RESUMES", function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(50000);
            return chakram.get(url + '?limit=20', {
                headers: {'x-access-token': tokens[0].token},
                json: true
            }).then(function (resumeResult) {
                expect(resumeResult.response.statusCode).to.equal(200);
                expect(resumeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(resumeResult.body).to.not.be.null;
                expect(resumeResult.body).to.not.be.undefined;
                expect(resumeResult.body.length).to.greaterThan(testCaseData.expected.count);
                dynamicId = resumeResult.body[0].id;
            });
        });
        it("TEST_FOR_RESUME_TIMELINE", function (){
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            return chakram.get(url + '/AV3AXu6bpr5dVejmNugn/timeline', {
                headers: {'x-access-token': tokens[0].token},
                json: true
            }).then(function (resumeResult) {
                expect(resumeResult.response.statusCode).to.equal(200);
                expect(resumeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(resumeResult.body).to.not.be.null;
                expect(resumeResult.body).to.not.be.undefined;
                expect(resumeResult.body).to.be.an('object');
                if(resumeResult.body.totalExperience){
                    expect(resumeResult.body.totalExperience).to.not.be.undefined;
                }
                else {

                    expect(resumeResult.body.totalExperience).to.be.undefined;
                }
                if(resumeResult.body.totalWorkingYears){
                    expect(resumeResult.body.totalWorkingYears).to.not.be.undefined;
                }
                else  {
                    expect(resumeResult.body.totalWorkingYears).to.be.undefined;
                }
                if(resumeResult.body.work){
                    expect(resumeResult.body.work).to.not.be.undefined;
                }
                else {
                    {
                        expect(resumeResult.body.work).to.be.undefined;
                    }
                    if (resumeResult.body.skills) {
                        expect(resumeResult.body.skills).to.not.be.undefined;
                    }
                    else {
                        expect(resumeResult.body.skills).to.be.undefined;
                    }
                    if (resumeResult.body.education) {
                        expect(resumeResult.body.education).to.not.be.undefined;
                    }
                    else {
                        expect(resumeResult.body.education).to.be.undefined;
                    }
                }
            });
        });
        it("TEST_FOR_BASIC_POST_RESUME", function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase], resumeData = testCaseData.input;
            this.timeout(40000);
            return chakram.post(url, resumeData, {
                headers: {'x-access-token': tokens[a].token},
                json: true
            }).then(function (resumeResult) {
                expect(resumeResult.response.statusCode).to.equal(201);
                expect(resumeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(resumeResult.body).to.be.an('object');
                expect(!resumeResult.body.created).to.be.false;
                dynamicId = resumeResult.body._id;
                return chakram.get(url + '/' + dynamicId, {
                    headers: {'x-access-token': tokens[0].token},
                    json: true
                }).then(function (resumeResult) {
                    expect(resumeResult.response.statusCode).to.equal(200);
                    expect(resumeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(resumeResult.body).to.not.be.null;
                    expect(resumeResult.body).to.not.be.undefined;
                    expect(resumeResult.body).to.be.an('object');
                    expect(resumeResult.body.id).to.equal(dynamicId);
                    expect(resumeResult.body).to.have.property('basics').to.be.an('object');
                    expect(resumeResult.body.basics.name).to.equal(testCaseData.response._source.basics.name);
                    expect(resumeResult.body.basics.email).to.equal(testCaseData.response._source.basics.email);
                    expect(resumeResult.body.basics.label).to.equal(testCaseData.response._source.basics.label);
                    expect(resumeResult.body.basics.phone).to.equal(testCaseData.response._source.basics.phone);
                });
            });
        });
        it("TEST_FOR_BASIC_PUT_RESUME", function () {
            var testCase = this.test.title, testCaseData = data[testSuite][testCase];
            this.timeout(15000);
            return chakram.put(url + '/' + dynamicId, testCaseData.input, {
                headers: {'x-access-token': tokens[0].token},
                json: true
            }).then(function (resumeResult) {
                expect(resumeResult.response.statusCode).to.equal(200);
                expect(resumeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                expect(resumeResult.body).to.not.be.null;
                expect(resumeResult.body).to.not.be.undefined;
                expect(resumeResult.body).to.be.an('object');
                return chakram.get(url + '/' + dynamicId, {
                    headers: {'x-access-token': tokens[0].token},
                    json: true
                }).then(function (resumeResult) {
                    expect(resumeResult.response.statusCode).to.equal(200);
                    expect(resumeResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
                    expect(resumeResult.body).to.not.be.null;
                    expect(resumeResult.body).to.not.be.undefined;
                    expect(resumeResult.body).to.be.an('object');
                    expect(resumeResult.body.id).to.equal(dynamicId);
                    expect(resumeResult.body).to.have.property('basics').to.be.an('object');
                    expect(resumeResult.body.basics.name).to.equal(testCaseData.response._source.basics.name);
                    expect(resumeResult.body.basics.email).to.equal(testCaseData.response._source.basics.email);
                });
            });
        });
        it("TEST_FOR_BASIC_DELETE_RESUME", function () {
            this.timeout(15000);
            return chakram.delete(url + '/' + dynamicId, null, {
                headers: {'x-access-token': tokens[0].token},
                json: false
            }).then(function (resumeResult) {
                expect(resumeResult.response.statusCode).to.equal(204);
                return chakram.get(url + '/' + dynamicId, {
                    headers: {'x-access-token': tokens[0].token},
                    json: true
                }).then(function (resumeData) {
                    expect(resumeData.response.statusCode).to.equal(404);
                });
            });
        });
    }
    for (i = 0; i <= 0; i = i + 1) {
        execute(i);
    }
});
