var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('../config/config.json')
    data = require('../data/reviewsData.json'),
    baseUrl = config.mochaUrl,
    tokens = require('../tokens.js'),
    tokens = tokens.tokens;
    url = baseUrl + 'users' + '/public' + '/reviews';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("PUBLIC_REVIEWS", function () {
    var testSuite = this.title;
    var testSuiteData = {};
    it("TEST_FOR_BASIC_GET_ALL_PUBLIC_REVIEWS", function () {
        var testCase = this.test.title;
        var testCaseData = data[testSuite][testCase];
        this.timeout(15000);
        return chakram.get(url+ '?limit=3').then(function (reviewsResult) {
            expect(reviewsResult.response.statusCode).to.equal(200);
            expect(reviewsResult.response.headers).to.have.property("content-type", "application/json; charset=utf-8");
            expect(reviewsResult.body).to.not.be.null;
            expect(reviewsResult.body).to.not.be.undefined;
            if (reviewsResult.body[0].length > 0) {
                expect(reviewsResult.body[0]).to.have.property('_id');
                expect(reviewsResult.body[0]).to.have.property('message');
                expect(reviewsResult.body[0]).to.have.property('rating');
                expect(reviewsResult.body[0]).to.have.property('source');
                expect(reviewsResult.body[0]).to.have.property('is_used_for_marketing');
                expect(reviewsResult.body[0]).to.have.property('is_public');
                expect(reviewsResult.body[0]).to.have.property('improve_message');
                expect(reviewsResult.body[0]).to.have.property('feedback');
                expect(reviewsResult.body[0]).to.have.property('profile_image');
            }
        });
    });
});


