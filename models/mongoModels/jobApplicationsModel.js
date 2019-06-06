var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    Logger = require('../../utils/winston/logModule'),
    JobPostingsModel = require('../jobPostingsModel.js'),
    getSchema = require('../schemas/jobApplicationsSchema.js'),
    ResumesModel = require('./resumesModel.js'),
    schema = mongoose.Schema,
    jobApplicationsSchema = new schema(getSchema),
    JobApplicationsSchemaModel = mongoose.model('jobApplications', jobApplicationsSchema, 'jobApplications'),
    jobPostingsModel,
    resumesModel,
    log;

function JobApplicationsModel() {
    this.jobApplicationsSchemaModel = JobApplicationsSchemaModel;
    this.modelType = 'mongo';
    jobPostingsModel = new JobPostingsModel();
    resumesModel = new ResumesModel();
    log = new Logger();
    log.info('info at find method of candidateapplypositions model in mongo models');
}

JobApplicationsModel.prototype.find = function (params, callback) {
    var self = this;
    self.jobApplicationsSchemaModel.find(params.source, function (err, data) {
        if (err) {
            callback(err, null);
        }
        self.getJobData(data, function (err, getData) {
            callback(err, getData);
        });
    }).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
JobApplicationsModel.prototype.findOne = function (params, id, callback) {
    var self = this;
    self.jobApplicationsSchemaModel.findOne({_id: id}, function (err, data) {
        if (err) {
            callback(err, null);
        }
        self.getJobData(data || callback(err, data), function (err, getData) {
            callback(err, getData[0]);
        });
    });
};
JobApplicationsModel.prototype.create = function (data, callback) {
    var self = this;
    self.jobApplicationsSchemaModel.create(data, function (err, data) {
        if (err) {
            callback(err, null);
        }
        self.getJobData(data, function (err, getData) {
            callback(err, getData[0]);
        });
    });
};
JobApplicationsModel.prototype.update = function (id, data, callback) {
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    self.jobApplicationsSchemaModel.update(conditions, update, options, function (err, data) {
        if (err) {
            callback(err, null);
        }
        self.getJobData(data, function (err, getData) {
            callback(err, getData[0]);
        });
    });
};
JobApplicationsModel.prototype.remove = function (id, callback) {
    this.jobApplicationsSchemaModel.remove({_id: id}, callback);
};
JobApplicationsModel.prototype.getJobData = function (data, callback) {
    var jobApplyData = [];
    data = Array.isArray(data) ? data : Array.of(data);
    async.each(data, function (items, callback) {
        var applyJob = items.toObject();
        var candidateModel = mongoose.model('candidates');
        candidateModel.findOne({_id: applyJob.candidate_id}, function (err, candidateData) {
            applyJob.candidate = candidateData ? _.pick(candidateData, ['_id', 'user_profile']) : {};
            jobPostingsModel.getById(applyJob.job_id, function (err, jobPostingsData) {
                applyJob.job = jobPostingsData ? jobPostingsData: {};
                resumesModel.findOne({}, candidateData.resume_id, function (err, resumesData) {
                    if (resumesData) {
                        applyJob.resumes = resumesData.shortUid;
                        jobApplyData.push(applyJob);
                    } else {
                        jobApplyData.push(applyJob);
                    }
                    callback(null);
                });
            });
        });
    }, function (err) {
        callback(err, jobApplyData);
    });
};

JobApplicationsModel.prototype.getJobId = function(params, callback){
    var self = this;
    self.jobApplicationsSchemaModel.find({}, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            self.jobApplicationsSchemaModel.count({}, function (err, count) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, {latestAddedApplications: data, count: count})
                }
            });
        }
    }).sort({job_applied_date: -1}).limit(3);
};
JobApplicationsModel.prototype.getCandidateJobId = function(params, callback){
    var self=this;
    self.jobApplicationsSchemaModel.find({"candidate_id":params.decoded._id}, callback).sort({job_applied_date:-1}).limit(4)
};
JobApplicationsModel.prototype.findAppliedJobsCount = function(params, callback){
    var self=this;
    self.jobApplicationsSchemaModel.find({"candidate_id":params.decoded._id},callback)
};
JobApplicationsModel.prototype.findPopularJobs = function(params, callback){
    var self=this,popularJobs = [],finalData = [],count = 1;
    self.jobApplicationsSchemaModel.find({},function(err,data){
        if(err){
            callback(err,null)
        }else{
            data.map(function(val){
                popularJobs = popularJobs.concat(val.job_id).sort()
            })
            popularJobs.map(function(val,key){
                if(val === popularJobs[key + 1]){
                    count++
                }else{
                    finalData.push({job_id: val, count: count });
                    count = 1;
                }
            })
            callback(err,_.orderBy(finalData, ['count'], ['desc']).slice(0, 4))
        }
    })
};
module.exports = JobApplicationsModel;
