var request = require('request'),
    config = require('../../config/config.json'),
    CacheUtil = require('../cache/cacheUtil.js'),
    cache;

function ElasticSearchCache() {
    cache = new CacheUtil();
}

ElasticSearchCache.prototype.getResumeKeywords = function (callback) {
    var resumeUrl = {
        "rejectUnauthorized": false,
        "url": config.dev.meta_url + "/v1/resume/keywords",
        "method": "GET"
    };
    request(resumeUrl, function (err, response, data) {
        if (err) {
            callback(err);
        } else {
            var result = JSON.parse(data);
            callback(null, result[0]);
        }
    });
};
ElasticSearchCache.prototype.getDesignationKeywords = function (callback) {
    var designationUrl = {
        "rejectUnauthorized": false,
        "url": config.dev.meta_url + "/v1/designation/keywords",
        "method": "GET"
    };
    request(designationUrl, function (err, response, data) {
        if (err) {
            callback(err);
        } else {
            var result = JSON.parse(data);
            callback(null, result[0]);
        }
    });
};
module.exports = ElasticSearchCache;
