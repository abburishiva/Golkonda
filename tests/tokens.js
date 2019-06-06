var config = require('./config/config.json'),
    baseUrl = config.mochaUrl,
    chakram = require('chakram'),
    url = baseUrl + 'user/authenticate';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
describe("GENERATE TOKENS", function () {
    it("SUPER_TOKEN", function () {
        this.timeout(20000);
        return chakram.post(url, config.super)
            .then(function (responce) {
                tokens[0].token = responce.body.token;
            });
    });
    it("EMPLOYEE_TOKEN", function () {
        this.timeout(20000);
        return chakram.post(url, config.employee
        ).then(function (responce) {
                tokens[1].token = responce.body.token;
                tokens[1].id = responce.body.userData._id;
            });
    });
    it("CANDIDATE_TOKEN", function () {
        this.timeout(20000);
        return chakram.post(url, config.candidate
        ).then(function (responce) {
                tokens[2].token = responce.body.token;
                tokens[2].id = responce.body.userData._id;
            });
    });
});
var tokens =
    [{
        "role": "SUPER",
        "token": null,
        "name": "sudha",
        "isSuper": true
    },
        {
            "role": "EMPLOYEE",
            "token": null,
            "name": "venkatesh",
            "id": null,
            "isSuper": false
        },
        {
            "role": "CANDIDATE",
            "token": null,
            "name": "samuelsam4343",
            "id": null,
            "isSuper": false
        },
        {
            "role": "NEW_USER",
            "token": null,
            "name": "abc",
            "isSuper": false
        }];
module.exports.tokens = tokens;