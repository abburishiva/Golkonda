var chakram = require('chakram'),
    request = require('request'),
    expect = chakram.expect,
    token = require('./tokens.js'),
    config = require('./config/config.json'),
    tokens = token.tokens,
    data = require('./data/shareResume.json'),
    url = config.mochaUrl + 'share';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("SHARERESUMES", function () {
    var testSuite = this.title, response;
    it("TEST_FOR_GET_RESUME_BY_SHORTID_WITH_BASICINFO_PUBLIC_PERMISSIONS", function () {
        var testCase = this.test.title, testCaseData = data[testSuite][testCase];
        this.timeout(30000);
        return chakram.get(url + '/' + testCaseData.input.shortUid).then(function (result) {
            expect(result.response.statusCode).to.equal(200);
            expect(result.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(result.body).to.not.be.a('null');
            expect(result.body).to.not.be.an('undefined');
        });
    });
});