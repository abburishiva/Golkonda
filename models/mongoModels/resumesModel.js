var mongoose = require('mongoose'),
    Logger = require('../../utils/winston/logModule'),
    utils = require('../../utils/params/mongoParameters'),
    getSchema = require('../schemas/resumes.js'),
    randomString = require("randomstring"),
    log,
    schema = mongoose.Schema,
    resumesSchema = new schema(getSchema),
    ResumesSchemaModel = mongoose.model('resumes', resumesSchema, 'resumes');
function Resumes() {
    this.resumesSchemaModel = ResumesSchemaModel;
    this.modelType = 'mongo';
    log = new Logger();
}
function randomValu() {
    return randomString.generate({
        length: 8,
        charset: 'alphanumeric'
    });
}
Resumes.prototype.find = function (params, callback) {
    log.info('info at find method of Resumes model in mongo models');
    this.resumesSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
Resumes.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of Resumes model in mongo models');
    if (params.source && params.source.status) {
        this.resumesSchemaModel.findOne({resumeId: id}, callback);
    } else {
        this.resumesSchemaModel.findOne({resumeId: id}, {shortUid: 1}, callback);
    }

};
Resumes.prototype.create = function (data, callback) {
    log.info('info at create method of Resumes model in mongo models');
    data.shortUid = Date.now().toString(36);
    this.resumesSchemaModel.create(data, function (err, data) {
        callback(err, data);
    });

};
Resumes.prototype.update = function (id, data, callback) {
    var self = this, conditions = {resumeId: id}, update = data, options = {multi: true}, resumeId, sourceId, count, totalAverage;
    log.info('info at update method of Resumes model in mongo models');
    if (update) {
        if (update.feedbacks) {
            resumeId = {source: {resumeId: id}};
            self.find(resumeId, function (err, oldData) {
                if (err) {
                    callback(err, null);
                } else {
                    if (resumeId.source.resumeId === oldData[0].resumeId) {
                        if (((update.feedbacks.name && update.feedbacks.email) != '') && update.feedbacks.rating <= 5 && update.feedbacks.rating >= 0) {
                            count = 0;
                            for (var i=0; i<oldData[0].feedbacks.length; i++) {
                                if (update.feedbacks.email == oldData[0].feedbacks[i].email) {
                                    self.resumesSchemaModel.update({resumeId: id, "feedbacks.email":update.feedbacks.email}, {$set:{"feedbacks.$.message":update.feedbacks.message}}, options, callback);
                                    count ++;
                                }
                            }
                            if (count === 0) {
                                self.resumesSchemaModel.update(conditions, {$push: {feedbacks: update.feedbacks}}, options, function (err, data) {
                                    if (err) {
                                        callback(err, null);
                                    } else if (data && data.n === 0) {
                                        callback(err, null);
                                    } else if (data && data.n === 1 && data.nModified === 0) {
                                        callback(err, {message: "Feedback doesn't update...!"});
                                    } else if (data && data.n === 1 && data.nModified === 1) {
                                        var total = update.feedbacks.rating;
                                        for (var i = 0; i < oldData[0].feedbacks.length; i++) {
                                            total += oldData[0].feedbacks[i].rating;
                                        }
                                        totalAverage = (total / ((oldData[0].feedbacks.length + 1) * 5) * 100).toFixed(2);
                                        self.resumesSchemaModel.update(conditions, {$set: {average_rating: totalAverage}}, options, callback);
                                    }
                                });
                            }
                        } else {
                            var res = null;
                            callback(null ,res);
                        }
                    }
                }
            });
        } else if (update.isRefresh) {
            update.type = 'update';
            update.shortUid = randomValu();
            self.resumesSchemaModel.update(conditions, update, options, function (err, data) {
                if (err) {
                    callback(err, null);
                } else if (data && data.n === 0) {
                    callback(err, null);
                } else if (data && data.n === 1 && data.nModified === 0) {
                    callback(err, {message: "Resumes doesn't update...!"});
                } else if (data && data.n === 1 && data.nModified === 1) {
                    callback(err, update);
                }
            });
        } else {
            resumeId = {source: {resumeId: id}};
            self.find(resumeId, function (err, oldData) {
                if (err) {
                    callback(err, null);
                } else {
                    if (update.shortUid === oldData.shortUid) {
                        self.resumesSchemaModel.update(conditions, update, options, callback);
                    } else {
                        sourceId = {source: {shortUid: update.shortUid}};
                        self.find(sourceId, function (err, itemData) {
                            if (err) {
                                callback(err, null);
                            } else {
                                if (itemData.length > 0) {
                                    callback(err, {message: 'This uniqueId already exists. Please use another uniqueId.'});
                                } else {
                                    self.resumesSchemaModel.update(conditions, update, options, function (err, data) {
                                        if (err) {
                                            callback(err, null);
                                        } else if (data && data.n === 0) {
                                            callback(err, null);
                                        } else if (data && data.n === 1 && data.nModified === 0) {
                                            callback(err, {message: "Resumes doesn't update...!"});
                                        } else if (data && data.n === 1 && data.nModified === 1) {
                                            callback(err, update);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }

            });
        }
    } else {
        callback(null, {message: "Resumes doesn't update...!"});
    }
};
Resumes.prototype.remove = function (id, callback) {
    log.info('info at remove method of Resumes model in mongo models');
    this.resumesSchemaModel.remove({_id: id}, callback);

};

Resumes.prototype.findResumesCount = function (ResumesCount, callback) {
    var self = this;
    self.resumesSchemaModel.count({}, function (err, resume) {
        callback(err, {resume: resume});
    });
};

module.exports = Resumes;