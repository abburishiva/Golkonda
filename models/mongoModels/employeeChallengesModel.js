var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/employerChallengesSchema.js'),
    challengesSchema = new Schema(getSchema),
    EmployeeChallengesSchema = mongoose.model('employer_challenges', challengesSchema),
    log;

function EmployeeChallengesModel() {
    this.modelType = 'mongo';
    log = new Logger();
    this.employeechallengesSchema = EmployeeChallengesSchema;
}
EmployeeChallengesModel.prototype.find = function (params, callback) {
    log.info('info at find method of EmployeeChallenges Model in mongo models');
    this.employeechallengesSchema.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
EmployeeChallengesModel.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of EmployeeChallenges Model in mongo models');
    this.employeechallengesSchema.findOne({_id: id}, callback);
};
EmployeeChallengesModel.prototype.create = function (data, callback) {
    log.info('info at create method of EmployeeChallenges Model in mongo models');
    this.employeechallengesSchema.create(data, callback);
};
EmployeeChallengesModel.prototype.update = function (id, data, callback) {
    log.info('info at update method of EmployeeChallenges Model in mongo models');
    var conditions = {_id: id}, update = data, options = {multi: true};
    this.employeechallengesSchema.update(conditions, update, options, callback);
};
EmployeeChallengesModel.prototype.remove = function (id, callback) {
    log.info('info at remove method of EmployeeChallenges Model in mongo models');
    this.employeechallengesSchema.remove({_id: id}, callback);
};
EmployeeChallengesModel.prototype.search = function (params, callback) {
    log.info('info at search method of EmployeeChallenges Model in mongo models');
    this.employeechallengesSchema.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
module.exports = EmployeeChallengesModel;



