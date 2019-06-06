var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    getSchema = require('../schemas/newsLetterSchema'),
    newsLetterSchema = new Schema(getSchema),
    newsLetterSchemaModel = mongoose.model('newsLetter', newsLetterSchema, 'newsLetter');

function NewsLetterModel() {
    this.newsModel = newsLetterSchemaModel;
    this.modelType = 'mongo';
}
NewsLetterModel.prototype.find = function (params, callback) {
    this.newsModel.find(params.source, callback);
};
NewsLetterModel.prototype.findOne = function (params, id, callback) {
    this.newsModel.findOne({_id: id}, callback);
};
NewsLetterModel.prototype.create = function (data, callback) {
    this.newsModel.create(data, callback);
};
NewsLetterModel.prototype.update = function (id, data, callback) {
    var conditions = {_id: id}, update = data, options = {multi: true};
    this.newsModel.update(conditions, update, options, callback);
};
NewsLetterModel.prototype.remove = function (id, callback) {
    this.newsModel.remove({_id: id}, callback);
};
module.exports = NewsLetterModel;