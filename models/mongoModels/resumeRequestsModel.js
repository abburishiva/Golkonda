var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    getSchema = require('../schemas/resumeRequestsSchema.js'),
    NotificationEngineModel = require('../mysqlModels/notificationEngineModel'),
    resumeRequestsSchema = new Schema(getSchema),
    ResumeRequestsSchemaModel = mongoose.model('resumeRequests', resumeRequestsSchema, 'resumeRequests'),
    notificationEngineModel;

function ResumeRequests() {
    this.resumeRequestsModel = ResumeRequestsSchemaModel;
    notificationEngineModel = new NotificationEngineModel();
    this.modelType = 'mongo';
}

ResumeRequests.prototype.find = function (params, callback) {
    this.resumeRequestsModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
ResumeRequests.prototype.findOne = function (params, id, callback) {
    this.resumeRequestsModel.findOne({resumeId: id}, callback);
};
ResumeRequests.prototype.create = function (data, callback) {
    var notificationsData = data.notificationsData;
    delete data.notificationsData;
    if (data && data.resumeId && !data.notificationsData) {
        this.resumeRequestsModel.create(data, function (err, result) {
            if(err){
                callback(err, result);
            }else if(notificationsData){
                notificationsData.resumeID =  data.resumeId;
                notificationEngineModel.sendPush(notificationsData, function () {
                });
                callback(err, result);
            }else{
                callback(err, { message: 'Notification is not sent'});
            }

        });
    }
};
ResumeRequests.prototype.update = function (id, data, callback) {
    this.resumeRequestsModel.update(data, function (err, result) {
        callback(err, result);
    });
};
ResumeRequests.prototype.remove = function (id, callback) {
    this.resumeRequestsModel.remove({_id: id}, function (err, data) {
        callback(err, data);
    });
};

module.exports = ResumeRequests;
