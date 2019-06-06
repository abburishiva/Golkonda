var _ = require("lodash");
var async = require('async');

var reStructureJSONEntity = function (data) {
    var result,
        itemsMapped = _.mapKeys(data, function (value, key) {
            return _.replace(key, /__/g, '.');
        });
    return result = _.zipObjectDeep(_.keys(itemsMapped), _.values(itemsMapped));
};

var restructureJSONArray = function (data, callback) {
    var result = [];
    async.each(data, function (item, callback) {
        result.push(reStructureJSONEntity(item));
        callback();
    }, function (err) {
        callback(err, result);
    });
}
module.exports = {
    restructureJSONArray: restructureJSONArray,
    reStructureJSONEntity: reStructureJSONEntity
};