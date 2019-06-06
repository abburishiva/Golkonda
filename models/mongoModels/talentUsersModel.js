var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    getSchema = require('../schemas/talentUsersSchema'),
    usersSchema = new Schema(getSchema),
    authUsersSchemaModel = mongoose.model('talentUsers', usersSchema, 'talentUsers');

function TalentUserModel() {
    this.authUsersSchemaModel = authUsersSchemaModel;
    this.modelType = 'mongo';
}
TalentUserModel.prototype.find = function (params, callback) {
    this.authUsersSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
TalentUserModel.prototype.findOne = function (params, id, callback) {
    this.authUsersSchemaModel.findOne({_id: id}, callback);
};
TalentUserModel.prototype.create = function (data, callback) {
    this.authUsersSchemaModel.create(data, callback);
};
TalentUserModel.prototype.update = function (id, data, callback) {
    var conditions = {candidateId: id}, update = data, options = {multi: true};
    this.authUsersSchemaModel.update(conditions, update, options, callback);
};
TalentUserModel.prototype.remove = function (id, callback) {
    this.authUsersSchemaModel.remove(id, callback);
};
module.exports = TalentUserModel;