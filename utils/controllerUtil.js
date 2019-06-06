var sqlModelParams = require('../utils/params/modelParameters'),
    mongoModelParams = require('../utils/params/mongoParameters'),
    Logger = require('../utils/winston/logModule'),
    CacheUtil = require('../utils/cache/cacheUtil'),
    cache,
    log;

function ControllerUtilFunction() {
    cache = new CacheUtil();
    log = new Logger();
}

ControllerUtilFunction.prototype.get = function (commonModel, req, res, next) {
    log.info("This is controllerutil get function");
    var params;
    if (commonModel.modelType === 'mySql') {
        log.info("request is coming to sqlModelParams ");
        params = sqlModelParams(req);
    } else {
        log.info("request is coming to mongoModelParams ");
        params = mongoModelParams(req);
        if (req.baseUrl === "/v1/users/public/reviews") {
            params.isPublic = true;
            params.sort = "lastmoddatetime";
        }
    }
    if (commonModel.modelData && commonModel.modelData.toLowerCase() === 'interviews') {
        req.url = req.url.split('?').shift();
    }
    cache.get(req.baseUrl, req.url, req.query, function (err, cacheData) {
        log.info("Getting the data from cache");
        log.error(req, err);
        if (cacheData) {
            log.info("this is cacheData:-");
            if (commonModel.modelData && commonModel.modelData.toLowerCase() === 'interviews') {
                params.isCache = true;
                commonModel.getDistinct(params, cacheData, function (err, data) {
                    if (err) {
                        log.error(req, err);
                        return next({status: 500, error: err});
                    } else if (data.length <= 0) {
                        res.status(204).json({status: 404, message: 'Records Not Found'});
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        return res.status(200).json(data);
                    }
                });
            } else {
                if (req.baseUrl === "/v1/resumes" || req.baseUrl === "/v1/organizations") {
                    res.header('X-TOTAL-COUNT', cacheData.hits.total);
                    res.status(200).json(cacheData.hits.hits);
                } else {
                    res.header('X-TOTAL-COUNT', cacheData.length);
                }
                res.status(200).json(cacheData);
            }
        } else {
            commonModel.find(params, function (err, data) {
                log.info("Getting the data from database");
                if (err) {
                    log.error(req, err);
                    return next({status: 500, error: err});
                }
                if (!data || data.length <= 0) {
                    log.info("Records Not Found");
                    res.status(204).json({status: 404, message: 'Records Not Found'});
                } else if (data && (data.status || data.message)) {
                    log.info("Bad Request");
                    data.message = data.message ? data.message : 'Bad Request';
                    res.status(400).json({status: 400, message: data.message});
                } else {
                    cache.set(req.baseUrl, req.url, data, function (err) {
                        if (err) {
                            return next({status: 500, error: err});
                        }
                    });
                    if (commonModel.modelData && commonModel.modelData.toLowerCase() === 'interviews') {
                        commonModel.getDistinct(params, data, function (err, results) {
                            if (err) {
                                log.error(req, err);
                                return next({status: 500, error: err});
                            } else if (results.length <= 0) {
                                res.status(204).json({status: 404, message: 'Records Not Found'});
                            } else {
                                res.header('X-TOTAL-COUNT', results.length);
                                return res.status(200).json(results);
                            }
                        });
                    } else {
                        log.info("Total number of records", data.length);
                        if (req.baseUrl === "/v1/resumes" || req.baseUrl === "/v1/organizations") {
                            res.header('X-TOTAL-COUNT', data.hits.total);
                            res.status(200).json(data.hits.hits);
                        } else {
                            res.header('X-TOTAL-COUNT', data.length);
                        }
                        res.status(200).json(data);
                    }
                }
            });
        }
    });
};
ControllerUtilFunction.prototype.getById = function (commonModel, req, res, next) {
    log.info("This is controllerutil getById function ");
    cache.get(req.baseUrl, req.url, req.params, function (err, cacheData) {
        log.info("Getting the data from cache");
        if (cacheData) {
            log.info("this is cacheData:-");
            res.status(200).json(cacheData);
        } else {
            var params;
            if (commonModel.modelType === 'mySql') {
                log.info("request is coming to sqlModelParams ");
                params = sqlModelParams(req);
            } else {
                log.info("request is coming to mongoModelParams ");
                params = mongoModelParams(req);
                if (params.source._id) {
                    req.params.id = params.source._id;
                }
            }
            commonModel.findOne(params, req.params.id, function (err, data) {
                log.info("Getting the data from database");
                if (err) {
                    log.error(req, err);
                    return next({status: 500, error: err});
                }
                if (!data || data.length <= 0) {
                    log.info("Records Not Found...!");
                    res.status(404).json({status: 404, message: 'Records Not Found'});
                } else {
                    cache.set(req.baseUrl, req.url, data, function (err) {
                        log.info("Setting the data into cache...!");
                        if (err) {
                            log.error(req, err);
                            return next({status: 500, error: err});
                        }
                    });
                    res.status(200).json(data);
                }
            });
        }
    });
};
ControllerUtilFunction.prototype.create = function (commonModel, req, res, next) {
    log.info("This is controllerutil create function ");
    if (req.decoded && req.decoded._id) {
        if (req.body) {
            log.info("This is controllerutil create function and req in req decoded condition");
            req.body.lastmoddatetime = new Date().toISOString();
            req.body.lastmoduserid = req.decoded._id;
        }
    }
    log.info("This is controllerutil create function and req goes to model");
    commonModel.create(req.body, function (err, result) {
        log.info("Posting the data");
        if (err) {
            log.error(req, err);
            return next({status: 500, error: err});
        } else {
            log.info("Data is deleted in cache...!!");
            cache.delete(req.baseUrl, req.url);
            if (result.type === 'update') {
                log.info("Record is Created...!!");
                res.status(200).json(result.data);
            } else {
                if (result.data) {
                    result = result.data;
                }
                res.status(201).json(result);
            }
        }
    });
};
ControllerUtilFunction.prototype.update = function (commonModel, req, res, next) {
    log.info("This is controllerutil update function ");
    var params;
    if (commonModel.modelType === 'mySql') {
        log.info("request is coming to sqlModelParams ");
        params = sqlModelParams(req);
    } else {
        log.info("request is coming to sqlModelParams ");
        params = mongoModelParams(req);
        if (params.source._id) {
            req.params.id = params.source._id;
        }
    }
    if (req.decoded && req.decoded._id) {
        if (req.body) {
            log.info("This is controllerutil update function and req in req decoded condition");
            req.body.lastmoddatetime = new Date().toISOString();
            req.body.lastmoduserid = req.decoded._id;
        }
    }
    log.info("This is controllerutil update function and req goes to model");
    commonModel.update(req.params.id, req.body, function (err, result) {
        log.info("updating the data:-" + result);
        if (err) {
            log.error(req, err);
            return next({status: 500, error: err});
        } else if (result === null) {
            log.info("No Content Is Updated");
            res.status(404).json({status: 404, message: 'No Content Is Updated'});
        } else {
            log.info("Data is deleted in cache...!!");
            cache.delete(req.baseUrl, req.url);
            if (result.type === 'create') {
                log.info("Record Is Updated......!");
                res.status(201).json(result.data);
            } else {
                if (result.data) {
                    result = result.data;
                }
                res.status(200).json(result);
            }
        }
    });
};
ControllerUtilFunction.prototype.remove = function (commonModel, req, res, next) {
    log.info("This is controllerutil remove function ");
    var params;
    if (commonModel.modelType === 'mySql') {
        log.info("request is coming to sqlModelParams");
        params = sqlModelParams(req);
    } else {
        log.info("request is coming to mongoModelParams ");
        params = mongoModelParams(req);
        if (params.source._id) {
            req.params.id = params.source._id;
        }
        if (req.query.q) {
            req.params.id = req.query.q;
        }
    }
    commonModel.remove(req.params.id, function (err, data) {
        log.info("deleting the data");
        log.info(data);
        if (err) {
            log.error(req, err);
            return next({status: 500, error: err});
        } else if (data === null || data.affectedRows <= 0) {
            log.info("Record Not Found To Delete");
            res.status(404).json({status: 404, message: 'Record Not Found To Delete'});
        } else {
            cache.delete(req.baseUrl, req.url);
            log.info("Resource is Deleted Successfully...!");
            res.status(204).send(JSON.stringify({
                message: 'resource(s) deleted.'
            }));
        }
    });
};

module.exports = ControllerUtilFunction;
