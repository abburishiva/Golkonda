var AnalyticsQuestionModel = require('../models/mysqlModels/analyticsQuestionModel'),
    sqlModelParams = require('../utils/params/modelParameters'),
    acqm;

function AnalyticsQuestionController() {
    acqm=new AnalyticsQuestionModel();
}
AnalyticsQuestionController.prototype.getAll = function (req, res, next) {
    var params = sqlModelParams(req);
    acqm.find(params, function (err, data) {
        if (err) {
            return next({status: 500, error: err});
        }
        if (data.length <= 0) {
            res.status(404).json({status: 404, message: 'Records Not Found'});
        } else {
            res.header('X-TOTAL-COUNT', data.length);
            res.status(200).json(data);
        }
    });
};

module.exports = AnalyticsQuestionController;