var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    cacheRoutesSchema = new Schema({
        route: {type: String}
    }),
    cacheRoutesSchemaModel = mongoose.model('cache_routes', cacheRoutesSchema);

function CacheLoadModel() {
    this.cacheRoutesSchemaModel = cacheRoutesSchemaModel;
    this.modelType = 'mongo';
}

CacheLoadModel.prototype.find = function (params, callback) {
    this.cacheRoutesSchemaModel.find(params.source, callback);
};
CacheLoadModel.prototype.findOne = function (params, id, callback) {
    this.cacheRoutesSchemaModel.findOne({_id: id}, callback);
};
CacheLoadModel.prototype.create = function (data, callback) {
    this.cacheRoutesSchemaModel.create(data, callback);
};
CacheLoadModel.prototype.update = function (id, data, callback) {
    var conditions = {_id: id}, update = data, options = {multi: true};
    this.cacheRoutesSchemaModel.update(conditions, update, options, function (err) {
        callback(err, data);
    });
};
CacheLoadModel.prototype.remove = function (id, callback) {
    this.cacheRoutesSchemaModel.remove({_id: id}, callback);
};
module.exports = CacheLoadModel;
