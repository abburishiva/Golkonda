var _ = require('lodash'),
    mongoose = require('mongoose'),
    config = require('../config/config.json'),
    JPUtil = require('../utils/elasticSearch/jobPostingsUtil'),
    jpUtil;

function JobPostingsModel() {
    jpUtil = new JPUtil(config.dev.es_host);
}

JobPostingsModel.prototype.findAll = function (req, callback) {
    var self = this;
    jpUtil.isIndexExist(config.dev.es_job.indexName, function (err, exist) {
        if (exist) {
            if (req.query && !(req.query.limit || req.query.page)) {
                callback(null, {status: 400, message: "request with limit or page"});
            }
            if (req.query && req.query.q) {
                self.search(req.query.q, function (err, result) {
                    callback(err, result);
                });
            } else if (req.query && req.query.candidate_id && (req.query.skill || req.query.category)) {
                jpUtil.filtering(config.dev.es_job.indexName, config.dev.es_job.type, req, req.query.limit, req.query.page, function (err, result) {
                    var jobApplicationsModel = mongoose.model('jobApplications');
                    jobApplicationsModel.find({candidate_id: req.query.candidate_id}, function (err, jobData) {
                        if (err) {
                            callback(err, null);
                        } else {
                            var jobCollection = result.hits.hits;
                            result.hits.hits = [];
                            result.hits.hits = _.filter(jobCollection, _.conforms({
                                "id": function (id) {
                                    return _.map(jobData, 'job_id').indexOf(id) < 0;
                                }
                            }));
                            result.hits.total = result.hits.hits.length;
                            callback(err, result);
                        }
                    });
                });
            } else if (req.params || req.query) {
                jpUtil.filtering(config.dev.es_job.indexName, config.dev.es_job.type, req, req.query.limit, req.query.page, function (err, result) {
                    callback(err, result);
                });
            } else {
                jpUtil.findAll(config.dev.es_job.indexName, config.dev.es_job.type, req.query.limit, req.query.page, function (err, result) {
                    callback(err, result);
                });
            }
        } else {
            callback(err, {status: 400, message: "collection not found in DB"});
        }
    })
};
JobPostingsModel.prototype.search = function (data, callback) {
    var dictionaryKeywords = [], unMatchedKeywords, originalKeywords;
    originalKeywords = data.split(/['.',',','_']/);
    unMatchedKeywords = originalKeywords.slice();
    jpUtil.basicSearch(config.dev.es_job.indexName, config.dev.es_job.type, dictionaryKeywords, unMatchedKeywords, function (err, result) {
        callback(err, result);
    });
};
JobPostingsModel.prototype.getById = function (id, callback) {
    jpUtil.isDocumentExist(config.dev.es_job.indexName, config.dev.es_job.type, id, function (err, exist) {
        if (exist) {
            jpUtil.displayDocument(config.dev.es_job.indexName, config.dev.es_job.type, id, function (err, display) {
                callback(err, display);
            });
        } else {
            callback(err, null);
        }
    });
};
JobPostingsModel.prototype.create = function (data, callback) {
    jpUtil.checkDuplicate(config.dev.es_job.indexName, config.dev.es_job.type, data.job.title, data.job.employer.email, function (err, duplicateData) {
        if (err) {
            callback(err, null);
        } else if (duplicateData === "This job Already Exist") {
            callback(null, {message: "This job Already Exist"})
        } else if (duplicateData === "save") {
            var schema = checkSchema(data.job),
                req = {
                    "query": {
                        "limit": 10,
                        "page": 1,
                        "uid": data.job.uid
                    }
                };
            if (schema === true) {
                jpUtil.filtering(config.dev.es_job.indexName, config.dev.es_job.type, req, req.query.limit, req.query.page, function (err, dupleResult) {
                    if (dupleResult && (dupleResult.hits.total === 0)) {
                        convertSkillsToCategorys(data.job.skills, function (err, categResult) {
                            if (err) {
                                callback(err, null);
                            } else {
                                data.job.categories = categResult;
                                delete data.job.skills;
                                jpUtil.addDocument(config.dev.es_job.indexName, config.dev.es_job.type, _.pick(data, ['job', 'lastmoduserid', 'lastmoddatetime']), function (err, addData) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        data.id = addData._id;
                                        callback(err, data);
                                    }
                                });
                            }
                        });
                    } else {
                        callback(err, {message: "This UID is already exist"});
                    }
                });
            } else {
                callback(null, {message: schema});
            }
        }
    });
};
JobPostingsModel.prototype.update = function (id, data, callback) {
    jpUtil.isDocumentExist(config.dev.es_job.indexName, config.dev.es_job.type, id, function (err, exist) {
        if (exist) {
            var schema = checkSchema(data.job);
            if (schema === true) {
                convertSkillsToCategorys(data.job.skills, function (err, result) {
                    if (err) {
                        callback(err, null);
                    } else {
                        data.job.categories = result;
                        delete data.job.skills;
                        jpUtil.updateDocument(config.dev.es_job.indexName, config.dev.es_job.type, id, _.pick(data, ['job', 'lastmoduserid', 'lastmoddatetime']), function (err, display) {
                            callback(err, data);
                        });
                    }
                });
            } else {
                callback(null, {message: schema});
            }
        } else {
            callback(err, null);
        }
    });
};
JobPostingsModel.prototype.remove = function (id, callback) {
    jpUtil.isDocumentExist(config.dev.es_job.indexName, config.dev.es_job.type, id, function (err, exist) {
        if (exist) {
            jpUtil.deleteDocument(config.dev.es_job.indexName, config.dev.es_job.type, id, function (err, display) {
                var jobApplicationsModel = mongoose.model('jobApplications');
                jobApplicationsModel.findOne({'job_id': id}, function (err, data) {
                    if (err) {
                        callback(err, display);
                    } else if (data) {
                        jobApplicationsModel.remove({_id: data._id}, function (err) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(err, display);
                            }
                        });
                    } else {
                        callback(err, display);
                    }
                });
                callback(err, display);
            });
        } else {
            callback(err, null);
        }
    });
};

JobPostingsModel.prototype.jobsCount = function (skills_interested, callback) {
    jpUtil.findJobs(config.dev.es_job.indexName, config.dev.es_job.type, skills_interested, function (err, result) {
        callback(null, result);
    });
};

JobPostingsModel.prototype.latestJobs = function (params, callback) {
    var self = this, recentJobs = [];
    jpUtil.latestJobs(config.dev.es_job.indexName, config.dev.es_job.type, params, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            result.map(function (obj) {
                if (params.decoded.role === 'candidate') {
                    recentJobs.push({
                        date: obj._source.lastmoddatetime,
                        name: obj._source.job.organization.name,
                        url: obj._source.job.organization.url,
                        valid_through: obj._source.job.valid_through,
                        position: obj._source.job.title,
                        positionStatus: obj._source.job.positionStatus,
                        location: obj._source.job.location,
                        employment_type:obj._source.job.employment_type,
                        description:obj._source.job.description,
                        employer:obj._source.job.employer.name,
                        jobid:obj._id
                    })
                } else {
                    recentJobs.push({date: obj._source.lastmoddatetime, position: obj._source.job.title})
                }
            });
            self.jobsCount([], function (err, data) {
                if (err) {
                    callback(err, null)
                } else {
                    callback(null, {
                        totalJobs: data.totalJobs,
                        totalJobsCount: data.totalJobsCount,
                        recentPostedJobs: recentJobs
                    })
                }
            })
        }
    });
};
JobPostingsModel.prototype.getMultipleDocuments = function (params, callback) {
    if(params.length<=0){
        callback(null,[]);
    }else {
        jpUtil.getMultipleDocuments(config.dev.es_job.indexName, config.dev.es_job.type, params, function (err, result) {
            if (err) {
                callback(err, null)
            } else {
                callback(err, result)
            }
        });
    }
};

function convertSkillsToCategorys(skills, callback) {
    jpUtil.displayOnlySkills(config.dev.es_skills.indexName, config.dev.es_skills.type, skills, function (err, skillsResult) {
        var intersectionSkills = _.intersectionWith(skillsResult.hits.hits, skills, function (o1, o2) {
            return _.lowerCase(o1['skill']) === _.lowerCase(o2);
        });
        callback(null, _.chain(intersectionSkills).groupBy("category").map(function (skillValues, category) {
            return {
                category: category,
                skills: _.map(skillValues, 'skill')
            }
        }).value());
    });
}

var checkSchema = function (data) {
    if (data) {
        if (!data.positionStatus) {
            data.positionStatus = "open";
        }
        if ((data.source) && (typeof (data.source) === "string")) {
            if ((data.title) && (typeof (data.title) === "string")) {
                if ((data.description) && (typeof (data.description) === "string")) {
                    if ((data.location) && !(Array.isArray(data.location)) && (typeof (data.location) === "object") && (!_.isEmpty(data.location))) {
                        if ((data.organization) && !(Array.isArray(data.organization)) && (typeof (data.organization) === "object") && (!_.isEmpty(data.organization))) {
                            if ((data.employer && data.employer.email) && (typeof (data.employer.email) === "string")) {
                                if ((data.skills) && (Array.isArray(data.skills)) && (data.skills.length > 0)) {
                                    if (data.uid && !Number.isNaN(data.uid)) {
                                        return true;
                                    } else {
                                        return "uid field is empty or invalid";
                                    }
                                } else {
                                    return "skills field is empty or invalid";
                                }
                            } else {
                                return "email Field format is invalid in employer object";
                            }
                        } else {
                            return "organization Field format is invalid";
                        }
                    } else {
                        return "locations Field format is invalid";
                    }
                } else {
                    return "description Field format is invalid";
                }
            } else {
                return "title Field format is invalid";
            }
        } else {
            return "source Field format is invalid";
        }
    } else {
        return "Something went wrong"
    }
};

JobPostingsModel.prototype.getData = function (req, callback) {
    jpUtil.filterDataCount(config.dev.es_job.indexName, config.dev.es_job.type, req, function (err, result) {
        callback(err, result);
    });
};

module.exports = JobPostingsModel;
