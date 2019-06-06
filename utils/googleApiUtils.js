var request = require('request'),
    conf = require('./../config/config');

function GoogleApiUtils() {
}

GoogleApiUtils.prototype.find = function (body, callback) {
    var options = {
        method: 'POST',
        url: 'https://www.googleapis.com/oauth2/v3/token',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            client_id: conf.googleApi.client_id,
            client_secret: conf.googleApi.client_secret,
            grant_type: conf.googleApi.grant_type,
            refresh_token: conf.dev.google_token
        })
    };
    request(options, function (err, response, resBody) {
        if (err) {
            callback(err, null);
        } else {
            callback(err, resBody);
        }
    });
};

module.exports = GoogleApiUtils;