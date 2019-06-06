var mongoose = require('mongoose'),
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/userReviewsSchema.js'),
    Schema = mongoose.Schema,
    userReviewSchema = new Schema(getSchema),
    userReviewSchemaModel = mongoose.model('userReviews', userReviewSchema, 'userReviews'),
    log;

function UserReviewsModel() {
    this.userReviewSchemaModel = userReviewSchemaModel;
    this.modelType = 'mongo';
    log = new Logger();
}
UserReviewsModel.prototype.find = function (params, callback) {
    log.info('info at find method of user_reviews model in mongo models');
    if (params.isPublic) {
        log.info('info at find method of user_reviews  model in mongo models and getting data of is_public is true');
        this.userReviewSchemaModel.find({isPublic: true}, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
        log.info('successfully call back the data of is_public is true of find method of user_reviews model in mongo models');
    } else {
        this.userReviewSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
        log.info('successfully call back the data of find method of user_reviews model in mongo models');
    }
};
UserReviewsModel.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of user_reviews model in mongo models');
    this.userReviewSchemaModel.findOne({_id: id}, callback);
    log.info('successfully call back the data of findOne method of user_reviews model in mongo models');
};
UserReviewsModel.prototype.create = function (data, callback) {
    log.info('info at create method of user_reviews model in mongo models');
    this.userReviewSchemaModel.create(data, callback);
};
UserReviewsModel.prototype.update = function (id, data, callback) {
    log.info('info at update method of user_reviews model in mongo models');
    var conditions = {_id: id}, update = data, options = {multi: true};
    this.userReviewSchemaModel.update(conditions, update, options, function (err) {
        callback(err, update);
    });
};
UserReviewsModel.prototype.remove = function (id, callback) {
    log.info('info at remove method of user_reviews model in mongo models');
    this.userReviewSchemaModel.remove({_id: id}, callback);
    log.info('successfully remove one record of user_reviews model in mongo models.');
};
UserReviewsModel.prototype.search = function (params, callback) {
    log.info('info at search method of user_reviews model in mongo models');
    this.userReviewSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
    log.info('successfully call back the data of search method of user_reviews model in mongo models');
};
module.exports = UserReviewsModel;
