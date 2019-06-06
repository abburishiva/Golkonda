var request = require('request'),
    async = require('async'),
    config = require('../../config/config.json'),
    baseUrl = config.devUrl,
    urls = [baseUrl + "subjects?type=all", baseUrl + "common/levels", baseUrl + "common/types", baseUrl + "common/categories", baseUrl + "users/public/reviews?limit=3"];
function CacheFill() {

}
CacheFill.prototype.cacheFill = function (req, res) {
    async.eachOf(urls, function (key) {
        request.get(key, function (error, responce, data) {
            if (error) {
                return res.status(500).send(error);
            }
        });
    });
    res.status(200).send({"status": 200, "message": "data has set into cache"});
};

module.exports = CacheFill;