var ElasticSearchModel = require('../models/elasticSearchResumesModel'),
    mongoModelParams = require('../utils/params/mongoParameters'),
    ResumesModel = require('../models/mongoModels/resumesModel'),
    CommonController = require('../utils/controllerUtil'),
    controllerUtil,
    rm,
    esm,
    body;

function ElasticSearchController() {
    esm = new ElasticSearchModel();
    rm=new ResumesModel();
    controllerUtil = new CommonController();
}

ElasticSearchController.prototype.get = function (req, res, next) {
    controllerUtil.get(esm, req, res, next);
};
ElasticSearchController.prototype.getById = function (req, res, next) {
    if (req.url && req.url.indexOf('/stats') > 0) {
        req.query['status']=true;
        controllerUtil.getById(rm, req, res, next);
    } else if (req.url && req.url.indexOf('/short_uid') > 0) {
        req.query['status']=false;
        controllerUtil.getById(rm, req, res, next);
    }else{
        controllerUtil.getById(esm, req, res, next);
    }
};
ElasticSearchController.prototype.resumeFeedback = function (req, res, next) {
    controllerUtil.update(rm, req, res, next);
};
ElasticSearchController.prototype.getTimeLineData = function (req, res) {
    var params = mongoModelParams(req);
    if (params.source._id) {
        req.params.id = params.source._id;
    }
    esm.getTimeLineData(params, req.params.id, function (err, data) {
        if (err) {
            return ({status: 500, message: 'No Routes found'});
        }
        if (data) {
            return res.status(200).json(data);
        } else {
            return res.status(204).json({status: 400, message: 'No Routes found'});
        }
    });
};
ElasticSearchController.prototype.create = function (req, res, next) {
    if (!req.body.basics.name || !req.body.basics.email) {
        res.status(400).send("Bad request");
    } else {
        controllerUtil.create(esm, req, res, next);
    }
};
ElasticSearchController.prototype.searchWithDetails = function (req, res, next) {
    body = JSON.stringify(req.body);
    if (body === Object.create(null) || body.length === 2) {
        res.status(400).send("Bad request");
    } else if (req.body.type === 'filteringByField') {
        controllerUtil.create(esm, req, res, next);
    } else {
        controllerUtil.create(esm, req, res, next);
    }
};
ElasticSearchController.prototype.update = function (req, res, next) {
    controllerUtil.update(esm, req, res, next);
};
ElasticSearchController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(esm, req, res, next);
};
module.exports = ElasticSearchController;