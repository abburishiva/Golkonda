var _ = require('lodash'),
    config = require('../config/config.json'),
    EsUtil = require('../utils/elasticSearch/esUtil.js'),
    OrganizationsUtil = require('../utils/elasticSearch/organizationsUtil.js'),
    ClearbitUtil = require('../utils/clearbitUtils.js'),
    esUtil,
    orgUtil,
    ClearUtil;

function OrganizationsModel() {
    esUtil = new EsUtil(config.dev.es_host);
    orgUtil = new OrganizationsUtil(config.dev.es_host);
    ClearUtil = new ClearbitUtil();
}

OrganizationsModel.prototype.find = function (params, callback) {
    var orgObj = [];
    if (!params.paging.count) {
        callback(null, {status: 400, message: "limit is mandatory"});
    } else {
        if (params && (params.source.name || params.source.url || params.source.domain || params.source.q || params.source.location || params.source.industry)) {
            orgUtil.findOrganizations(config.dev.organizations.indexName, config.dev.organizations.type, params, function (err, result) {
                if (result && result.hits && result.hits.hits) {
                    if (result.hits && !result.hits.hits.length) {
                        callback(null, result.hits.hits)
                    } else {
                        callback(null, result);
                    }
                } else {
                    callback(err, null);
                }
            });
        } else if (params.filters.sorting === 'date') {
            params.filters.sorting = 'lastmoddatetime';
            esUtil.findAll(config.dev.organizations.indexName, config.dev.organizations.type, params, function (err, result) {
                if (result && result.hits && result.hits.hits) {
                    callback(null, result);
                } else {
                    callback(err, null);
                }
            });
        } else {
            orgUtil.findAll(config.dev.organizations.indexName, config.dev.organizations.type, params, function (err, result) {
                if (result && result.hits && result.hits.hits) {
                    callback(null, result);
                } else {
                    callback(err, null);
                }
            });
        }
    }
};
OrganizationsModel.prototype.findOne = function (params, id, callback) {
    esUtil.isDocumentExist(config.dev.organizations.indexName, config.dev.organizations.type, id, function (err, exist) {
        if (exist) {
            esUtil.displayDocument(config.dev.organizations.indexName, config.dev.organizations.type, id, function (err, data) {
                callback(err, data);
            });
        } else {
            callback(err, null);
        }
    });
};
OrganizationsModel.prototype.create = function (data, callback) {
    if (data && (data.url || data.domain) && data.name) {
        orgUtil.displayOrganization(config.dev.organizations.indexName, config.dev.organizations.type, data, function (err, filterData) {
            if (err) {
                callback(err, null);
            } else if (filterData.hits.total <= 0) {
                esUtil.addDocument(config.dev.organizations.indexName, config.dev.organizations.type, data, function (err, resData) {
                    if(err){
                        callback(err, null);
                    }else{
                        data.id = resData._id;
                        callback(err, data);
                    }
                });
            } else {
                callback(err, filterData.hits.hits[0]);
            }
        });
    } else {
        callback(null, {message: "Invalid url and name"});
    }
};

OrganizationsModel.prototype.update = function (id, reqData, callback) {
    esUtil.isDocumentExist(config.dev.organizations.indexName, config.dev.organizations.type, id, function (err, exist) {
        if (exist) {
            esUtil.displayDocument(config.dev.organizations.indexName, config.dev.organizations.type, id, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    if (data.name === reqData.name) {
                        update();
                    } else {
                        orgUtil.displayOrganizationName(config.dev.organizations.indexName, config.dev.organizations.type, reqData, function (err, filterData) {
                            if (err) {
                                callback(err, null);
                            } else if (filterData.length > 0) {
                                var orgName = false;
                                filterData.filter(function (value) {
                                    if (value._source.name === reqData.name) {
                                        orgName = true;
                                    }
                                });
                                if (orgName) {
                                    callback(null, {message: "This Company Already Exist"});
                                } else {
                                    update()
                                }
                            } else {
                                update();
                            }
                        });
                    }

                    function update() {
                        esUtil.updateDocument(config.dev.organizations.indexName, config.dev.organizations.type, id, reqData, function (err, display) {
                            callback(err, display);
                        });
                    }
                }
            });
        } else {
            callback(err, null);
        }
    });
};

OrganizationsModel.prototype.remove = function (id, callback) {
    esUtil.isDocumentExist(config.dev.organizations.indexName, config.dev.organizations.type, id, function (err, exist) {
        if (exist) {
            esUtil.deleteDocument(config.dev.organizations.indexName, config.dev.organizations.type, id, function (err, data) {
                callback(err, data);
            });
        } else {
            callback(err, null);
        }
    });
};
OrganizationsModel.prototype.getAllName = function (params, callback) {
    esUtil.count(config.dev.organizations.indexName,function (err,data) {
        var params={paging:{count:data.count,skip:0}}
        orgUtil.findAll(config.dev.organizations.indexName, config.dev.organizations.type, params, function (err, result) {
            if(result) {
                callback(null, result.hits.hits)
            }else{
                callback(err,null)
            }
        })
    });

}
OrganizationsModel.prototype.getMultipleLatestJobs = function (params, callback) {
    orgUtil.getMultipleDocuments(config.dev.es_job.indexName, config.dev.es_job.type, params, function (err, result) {
        if (err) {
            callback(err, null)
        } else {
            callback(err, result)
        }
    });
};

module.exports = OrganizationsModel;