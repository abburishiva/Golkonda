var request = require('request'),
    _ = require('lodash');

function ClearbitUtils() {
}

ClearbitUtils.prototype.getOrganization = function (data, callback) {
    var options = {
            method: 'GET',
            url: 'https://company-stream.clearbit.com/v2/companies/find',
            qs: {domain: data.url || data.domain},
            headers:
                {authorization: 'Bearer sk_7be6ae025296bf47e3350c6a28cf02c1'}
        },
        fileds = ['name', 'legalName', 'url', 'domain', 'category', 'tags', 'description', 'location', 'geo', 'logo', 'phone'];
    request(options, function (err, response, resBody) {
        if (err) {
            callback(err, null);
        } else {
            var obj = JSON.parse(resBody);
            obj.url = "www." + obj.domain;
            callback(err, refit_keys(_.pick(obj, fileds)));
        }
    });
};

function refit_keys(a) {
    var renameKey, serverKeyMap = {
        name: "name",
        legalName: "legalName",
        url: "url",
        domain: "domain",
        category:"category",
        tags: "tags",
        description: "description",
        location: "location",
        geo: "address",
        logo: "logo",
        phone: "telephone"
    };
    renameKey = _.mapKeys(a, function (value, key) {
        return serverKeyMap[key];
    });
    renameKey = (function filter(obj) {
        var filtered = _.pickBy(obj, function (v) {
            return v !== '' && v !== null;
        });
        return _.cloneDeepWith(filtered, function (v) {
            return v !== filtered && _.isPlainObject(v) ? filter(v) : undefined;
        });
    })(renameKey);
    return renameKey;
}


module.exports = ClearbitUtils;