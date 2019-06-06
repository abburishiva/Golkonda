var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Logger = require('../../utils/winston/logModule'),
    getSeekerSchema = require('../schemas/jobHelpRequestsSeekerSchema.js'),
    jobHelpRequestsSeekerSchemaModel = new Schema(getSeekerSchema),
    getHelperSchema = require('../schemas/jobHelpRequestsHelperSchema.js'),
    jobHelpRequestsHelperSchemaModel = new Schema(getHelperSchema),
    jobHelpRequestsSeekerSchema = mongoose.model('job_help_requests_seeker', jobHelpRequestsSeekerSchemaModel),
    jobHelpRequestsHelperSchema = mongoose.model('job_help_requests_helper', jobHelpRequestsHelperSchemaModel),
    log;

function JobHelpRequestsModel() {
    this.modelType = 'mongo';
    log = new Logger();
    this.jobHelpRequestsSeekerSchemaModel = jobHelpRequestsSeekerSchema;
    this.jobHelpRequestsHelperSchemaModel = jobHelpRequestsHelperSchema;
}

JobHelpRequestsModel.prototype.find = function (params, callback) {
    var self = this;
    self.jobHelpRequestsSeekerSchemaModel.find(params.source, {password: 0}, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            self.jobHelpRequestsHelperSchemaModel.find(params.source, {password: 0}, function (err, res) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, {seeker: data, helper: res});
                }
            }).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
        }
    }).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
JobHelpRequestsModel.prototype.findOne = function (params, id, callback) {
    var self = this;
    self.jobHelpRequestsSeekerSchemaModel.findOne({_id: id}, function (err, data) {

        if (err) {
            callback(err, null)
        } else if (data !== null) {
            callback(null, data)
        } else {
            self.jobHelpRequestsHelperSchemaModel.findOne({_id: id}, function (err, data) {
                callback(err, data)
            })
        }

    });
};
JobHelpRequestsModel.prototype.create = function (data, callback) {
    var self = this;
    self.jobHelpRequestsSeekerSchemaModel.findOne({"email": data.email}, function (err, res) {
        if (err) {
            callback(err, null)
        } else if (res && res.email) {
            callback(null, {message: "this email already exit"})
        } else if (data.role === 'helper') {
            self.jobHelpRequestsHelperSchemaModel.create(data, callback)
        } else {
            self.jobHelpRequestsSeekerSchemaModel.create(data, callback);
        }
    });
};
JobHelpRequestsModel.prototype.update = function (id, data, callback) {
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    self.jobHelpRequestsSeekerSchemaModel.update(conditions, update, options, function (err, data) {
        if (err) {
            callback(err, null)
        } else if (data !== null) {
            callback(null, data)
        } else {
            self.jobHelpRequestsHelperSchemaModel.update(conditions, update, options, function (err, data) {
                callback(err, data)
            })
        }
    })
};
JobHelpRequestsModel.prototype.remove = function (id, callback) {
    var self = this;
    self.jobHelpRequestsSeekerSchemaModel.remove({_id: id}, function (err, data) {
        if (err) {
            callback(err, null)
        } else if (data !== null) {
            callback(null, data)
        } else {
            self.jobHelpRequestsHelperSchemaModel.remove({_id: id}, function (err, data) {
                callback(err, data)
            })
        }

    });
};

JobHelpRequestsModel.prototype.login = function (body, callback) {
    var self = this;
    self.jobHelpRequestsHelperSchemaModel.findOne({"email": body.email, "password": body.password}, function (err, data) {
        if (err) {
            callback(err, null)
        } else if (data !== null) {
            callback(null, data)
        } else {
            self.jobHelpRequestsSeekerSchemaModel.findOne({"email": body.email, "password": body.password}, function (err, data) {
                callback(err, data)
            })
        }

    });
};

module.exports = JobHelpRequestsModel;
