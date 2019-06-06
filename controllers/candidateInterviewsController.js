var CandidateInterviewsModel = require('../models/mongoModels/candidateInterviewsModel'),
    mongoParams = require('../utils/params/mongoParameters'),
    CommonController = require('../utils/controllerUtil'),
    candidateInterviewsModel,
    controllerUtil;

function CandidateInterviewsController() {
    candidateInterviewsModel = new CandidateInterviewsModel();
    controllerUtil = new CommonController();
}
CandidateInterviewsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(candidateInterviewsModel, req, res, next);
};
CandidateInterviewsController.prototype.getById = function (req, res, next) {
    if (req.url && req.url.indexOf('shareInterviews') > 0) {
        req.query.status = 'getinterview';
        var params = mongoParams(req);
        candidateInterviewsModel.findOne(params, req.params.id, function (err, results) {
            if (err) {
                return next({status: 500, error: err});
            }
            if (!results) {
                res.status(404).send({message: 'No Records Found'});
            } else {
                res.status(200).json(results);
            }
        });
    } else {
        controllerUtil.getById(candidateInterviewsModel, req, res, next);
    }
};
CandidateInterviewsController.prototype.create = function (req, res, next) {
    controllerUtil.create(candidateInterviewsModel, req, res, next);
};
CandidateInterviewsController.prototype.update = function (req, res, next) {
    controllerUtil.update(candidateInterviewsModel, req, res, next);
};
CandidateInterviewsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(candidateInterviewsModel, req, res, next);
};
module.exports = CandidateInterviewsController;

