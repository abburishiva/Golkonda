var mongoose = require('mongoose'),
    EmailEngineModel = require('../mysqlModels/emailEngineModel'),
    ResumesModel = require('./resumesModel'),
    utils = require('../../utils/params/mongoParameters'),
    getSchema = require('../schemas/resumePermissionsSchema.js'),
    _ = require('lodash'),
    Schema = mongoose.Schema,
    resumePermissionSchema = new Schema(getSchema),
    resumeSchemaModel = mongoose.model('resumePermissions', resumePermissionSchema, 'resumePermissions'),
    resumesModel,
    emailEngine;

function ResumePermissions() {
    this.resumePermissionModel = resumeSchemaModel;
    resumesModel = new ResumesModel();
    emailEngine = new EmailEngineModel();
}

function sendEmail(emailList, message_type, subject, message) {
    var mailData;
    if (emailList && emailList.length > 0) {
        mailData = {
            to: emailList,
            message_type: message_type,
            subject: subject,
            message: message
        };
        emailEngine.sendMessage(mailData, function () {
        });
    }
}
function difference(old, update) {
    return _.difference(_.map(update, 'email'), _.map(old, 'email'));
}

function updateOne(updateData, oldData, callback) {
    var oldPrivateAccess, updatePrivateAccess;
    if (updateData.privateAccess && updateData.privateAccess.length > 0) {
        if (updateData.sendEmail) {
            oldPrivateAccess = oldData.privateAccess.slice();
            updatePrivateAccess = updateData.privateAccess.slice();
            sendEmail(difference(oldPrivateAccess, updatePrivateAccess), updateData.message_type, updateData.subject, updateData.message);
        }
    }
    callback(null);
}

ResumePermissions.prototype.find = function (params, callback) {
    if (params.source.type === 'emailPermissions') {
        this.resumePermissionModel.find({"privateAccess": {"$elemMatch": {"email": params.source.q}}}, {
            _id: 0,
            publicAccess: 0
        }, callback);
    } else {
        this.resumePermissionModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
    }
};
ResumePermissions.prototype.findOne = function (params, id, callback) {
    if (params.source['user_profile.email']) {
        var CandidatesModel = mongoose.model('candidates');
        CandidatesModel.find(params.source, function (err, data) {
            var result;
            if (data.length > 0) {
                result = data[0]['user_profile'];
            } else {
                result = null;
            }
            callback(err, result);
        });
    } else {
        this.resumePermissionModel.findOne({resumeId: params.source.resumeId}, callback);
    }
};
ResumePermissions.prototype.create = function (data, callback) {
    var self = this, dynamicId;
    if (data && data.resumeId) {
        dynamicId = utils({query: {resumeId: data.resumeId}});
        resumesModel.find(dynamicId, function (err, resumesData) {
            if (resumesData && resumesData.length > 0) {
                self.resumePermissionModel.create(data, callback);
            } else {
                callback(null, {status: 400, message: 'bad request'});
            }
        });
    } else {
        callback(null, {status: 400, message: 'bad request'});
    }
};
ResumePermissions.prototype.update = function (id, data, callback) {
    var self = this, conditions = {resumeId: id}, update = data, options = {multi: true}, resumeId;
    resumeId = utils({params: {resumeId: data.resumeId}});
    self.find(resumeId, function (err, oldData) {
        if (oldData.length > 0) {
            updateOne(update, oldData[0], function (exist) {
                if (exist) {
                    callback(null, exist);
                } else {
                    self.resumePermissionModel.update(conditions, update, options, function (err, results) {
                        self.resumePermissionModel.update(conditions, {$pull: {privateAccess: {email: {$in: update.removeEmails}}}}, options, function () {
                            callback(err, results);
                        });
                    });
                }
            });
        } else {
            callback(null, {status: 400, message: 'bad request'});
        }
    });
};
ResumePermissions.prototype.remove = function (id, callback) {
    this.resumePermissionModel.remove({resumeId: id}, callback);
};

module.exports = ResumePermissions;
