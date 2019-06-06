var CacheLoadModel = require('../models/mongoModels/cacheLoadModel'),
    mongoModelParams = require('../utils/params/mongoParameters'),
    async = require('async'),
    config = require('../config/config.json'),
    baseUrl = config.dev.base_url,
    request = require('request'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    Logger = require('../utils/winston/logModule'),
    log,
    cl;
function CacheLoadController() {
    cl = new CacheLoadModel();
    controllerUtil = new CommonController();
    log = new Logger();
    log.info("CacheLoadController constructor");
}
CacheLoadController.prototype.get = function (req, res) {
    var params = mongoModelParams(req);
    cl.find(params, function (err, data) {
        if (err) {
            return ({status: 400, message: 'No Routes found'});
        }
        if (data.length > 0) {
            async.each(data, function (item) {
                request.get(baseUrl + item.route, function (error) {
                    log.info("we are in request.get");
                    if (error) {
                        log.error(error);
                    }
                });
            });
            log.info(" CacheLoadController constructor.... Routes has set into cache");
            return res.status(200).json(data);
        }
        return res.status(400).json({status: 400, message: 'No Routes found'});
    });
};
CacheLoadController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(cl, req, res, next);
};
CacheLoadController.prototype.create = function (req, res, next) {
    controllerUtil.create(cl, req, res, next);
};
CacheLoadController.prototype.update = function (req, res, next) {
    controllerUtil.update(cl, req, res, next);
};
CacheLoadController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(cl, req, res, next);
};
module.exports = CacheLoadController;
