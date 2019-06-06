var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lookupUniversityModel = new Schema({
    id: {type: Number},
    alpha_two_code: {type: String},
    countryid: {type: Number},
    domain: {type: String},
    name: {type: String},
    web_page: {type: String},
    lastmodedatetime: {type: String},
    lastmodeuserid: {type: Number}
});

var lookupUniversitySchemaModel = mongoose.model('lookup_universities', lookupUniversityModel);

function LookupUniversity() {
    this.LookupUniversitySchemaModel = lookupUniversitySchemaModel;
}
LookupUniversity.prototype.modelType = 'mongo';

LookupUniversity.prototype.find = function (params, callback) {
    this.LookupUniversitySchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};

LookupUniversity.prototype.findOne = function (id, callback) {
    this.LookupUniversitySchemaModel.findOne({_id: id}, callback);
};

LookupUniversity.prototype.create = function (data, callback) {
    this.LookupUniversitySchemaModel.create(data, callback);
};

LookupUniversity.prototype.update = function (id, data, callback) {
    var conditions = {_id: id}, update = data, options = {multi: true};
    this.LookupUniversitySchemaModel.update(conditions, update, options, function (err, challenge) {
        callback(err, data);
    });
};

LookupUniversity.prototype.remove = function (id, callback) {
    this.LookupUniversitySchemaModel.remove({_id: id}, callback);
};

LookupUniversity.prototype.search = function (params, callback) {
    this.LookupUniversitySchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(params.paging.count);
};
module.exports = LookupUniversity;
