var chakram = require('chakram'),
    expect = chakram.expect,
    config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    token = require('./tokens'),
    url = baseUrl + 'candidates',
    tokens = token.tokens;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
describe("CANDIDATES", function () {
    var testSuite = this.title,  response,
        i, d, recordId;
    function execute(a) {
        describe("BASIC_GET_ALL_CANDIDATES", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_ALL_CANDIDATES_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '?limit=5', {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        recordId = result.body[0]._id;
                        function candidates(j) {
                            expect(!result.body[j]._id).to.be.false;
                            expect(!result.body[j].auth_details.registereddatetime).to.be.false;
                            expect(!result.body[j].auth_details.first_login_completed).to.be.false;
                            expect(!result.body[j].auth_details.is_user_verified).to.be.false;
                        }
                        for (var a = 0; a < result.body.length; a++) {
                            candidates(a)
                        }
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                    });
                }
            });
        });
        describe("BASIC_GET_CANDIDATE_BY_ID", function () {
            var getCases = this.title;
            it("TEST_FOR_BASIC_GET_CANDIDATE_BY_ID_FOR_" + tokens[a].role, function () {
                var testCase = this.test.title, data = require('./data/' + testSuite + '/' + getCases + '.json'), testCaseData = data[getCases][testCase];
                this.timeout(30000);
                response = chakram.get(url + '/' + recordId, {
                    headers: {'x-access-token': tokens[a].token},
                    json: true
                });
                if (tokens[a].role === "SUPER" || tokens[a].role === "EMPLOYEE") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body._id).to.equal(recordId);
                        if (result.body.auth_details.first_login_completed.toLowerCase() === 'y') {
                            expect(!result.body.user_profile.email).to.be.false;
                            expect(!result.body.source_details.username).to.be.false;
                        }
                        expect(!result.body.source_details.source).to.be.false;
                        expect(!result.body.auth_details.registereddatetime).to.be.false;
                        expect(!result.body.auth_details.first_login_completed).to.be.false;
                        expect(!result.body.auth_details.is_user_verified).to.be.false;
                    });
                }
                else if (tokens[a].role === "CANDIDATE") {
                    var candidateUrl = baseUrl + 'candidates/' + tokens[a].id,
                        getByIdResponse = chakram.get(candidateUrl, {
                            headers: {'x-access-token': tokens[a].token},
                            json: true
                        });
                    return getByIdResponse.then(function (result) {
                        expect(result.response.statusCode).to.equal(testCaseData.expected.statusCode);
                        expect(result.response.headers["content-type"]).to.be.equal(testCaseData.expected["content-type"]);
                        expect(result.body).to.not.be.null;
                        expect(result.body).to.not.be.undefined;
                        expect(result.body._id).to.equal(tokens[a].id);

                        expect(!result.body.source_details.password).to.be.false;
                        expect(!result.body.source_details.source).to.be.false;
                        expect(!result.body.auth_details.last_verification_code).to.be.false;
                        expect(!result.body.auth_details.registereddatetime).to.be.false;
                        if (result.body.auth_details.first_login_completed === 'y') {
                            expect(!result.body.user_profile.email).to.be.false;
                            expect(!result.body.source_details.username).to.be.false;
                        }
                        expect(!result.body.auth_details.first_login_completed).to.be.false;
                        expect(!result.body.auth_details.is_user_verified).to.be.false;
                    });
                }
                else if (tokens[a].role === "NEW_USER") {
                    return response.then(function (result) {
                        expect(result.response.statusCode).to.equal(401);
                    });
                }
            });
        });
    }
    for (i = 0; i < tokens.length; i = i + 1) {
        execute(i);
    }
});