var express = require('express'),
    router = express.Router(),
    AnalyticsChallengesQuestionController = require('../controllers/analyticsQuestionController'),
    acqc = new AnalyticsChallengesQuestionController();

//   v1/analytics_question
router.get('/', acqc.getAll.bind(acqc));
module.exports = router;

