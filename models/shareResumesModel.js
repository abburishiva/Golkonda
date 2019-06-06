var _ = require('lodash'),
    express = require('express'),
    app = express(),
    config = require('../config/config.json'),
    mongoParams = require('../utils/params/mongoParameters.js'),
    ESUtil = require('../utils/elasticSearch/resumeUtil'),
    ResumesModel = require('./mongoModels/resumesModel'),
    ResumePermission = require('./mongoModels/resumePermissionsModel'),
    esUtil, rm, rpAccess,
    basicInfo = ["basics.summary", "education"],
    workInfo = ["work", "skills", "volunteer", "awards"],
    privacyInfo = ["basics.name", "basics.email", "basics.label", "basics.phone", "references", "profiles"],
    publicInfo = ["basics.summary", "education", "work", "skills", "volunteer", "awards"];

function ElasticSearchModel() {
    esUtil = new ESUtil(config.dev.es_host);
    rm = new ResumesModel();
    rpAccess = new ResumePermission();
}

ElasticSearchModel.prototype.getById = function (id, email, callback) {
    var shortUid = mongoParams({query: {shortUid: id}});
    rm.find(shortUid, function (err, data) {
        if (err) {
            callback(err, null);
        } else if (data.length <= 0) {
            callback(err, {status: 404, message: "shortUid doesn't exist...!"});
        } else {
            var resume_Id = mongoParams({query: {resumeId: data[0].resumeId}});
            rpAccess.find(resume_Id, function (err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    if (result && result.length > 0) {
                        esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, data[0].resumeId, function (err, exist) {
                            if (exist) {
                                var publicAccess, privatePermissions, publicPermissionsAccess = [], privateAccess, privatePermissionsAccess = [], publicResumeAccess, count = 0,
                                    publicResumedata = [], publicData, privateResumeAccess = [];
                                publicAccess = result[0].publicAccess.permissions;
                                _.forEach(publicAccess, function (value) {
                                    publicData = permissionAccess(value);
                                    publicResumedata.push(publicData);
                                });
                                publicResumeAccess = Array.prototype.concat.apply(publicPermissionsAccess, publicResumedata);
                                if (!email) {
                                    esUtil.displayDocument(config.dev.es.indexName, config.dev.es.type, data[0].resumeId, publicResumeAccess, function (err, display) {
                                        callback(err, display);
                                    });
                                } else {
                                    for (var i = 0; i <= result[0].privateAccess.length - 1; i++) {
                                        if (result[0].privateAccess[i].email === email) {
                                            count++;
                                            if (count !== 0) {
                                                privatePermissions = result[0].privateAccess[i].privacyAccessIsEnable;
                                                if (!privatePermissions) {
                                                    privateAccess = Array.prototype.concat.apply(privatePermissionsAccess, [publicResumeAccess, publicInfo]);
                                                    privateResumeAccess = _.uniq(privateAccess);

                                                }
                                                if (privatePermissions) {
                                                    privateAccess = Array.prototype.concat.apply(privatePermissionsAccess, [publicResumeAccess, publicInfo, privacyInfo]);
                                                    privateResumeAccess = _.uniq(privateAccess);
                                                }
                                                esUtil.displayDocument(config.dev.es.indexName, config.dev.es.type, data[0].resumeId, privateResumeAccess, function (err, display) {
                                                    display.privateAccess = privatePermissions;
                                                    callback(err, display);
                                                });
                                            }
                                        }
                                    }
                                    if (count === 0) {
                                        esUtil.displayDocument(config.dev.es.indexName, config.dev.es.type, data[0].resumeId, publicResumeAccess, function (err, display) {
                                            display.newAccess = true;
                                            callback(err, display);
                                        });
                                    }
                                }
                            } else {
                                callback(err, null);
                            }
                        });
                    } else {
                        esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, data[0].resumeId, function (err, exist) {
                            if (exist) {
                                if (!email) {
                                    esUtil.displayDocument(config.dev.es.indexName, config.dev.es.type, data[0].resumeId, [], function (err, display) {
                                        callback(err, display);
                                    });
                                }
                            } else {
                                callback(err, null);
                            }
                        });
                    }
                }
            })
        }
    });
};
var permissionAccess = function (value) {
    if (value === 'basicInfo') {
        return basicInfo;
    } else if (value === 'workInfo') {
        return workInfo;
    } else if (value === 'publicInfo') {
        return publicInfo;
    } else if (value === 'privacyInfo') {
        return privacyInfo;
    }
};
module.exports = ElasticSearchModel;
