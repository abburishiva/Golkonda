var express = require('express'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CandidateController = require('../controllers/candidateController'),
    ChallengeController = require('../controllers/challengesController'),
    InterviewsController = require('../controllers/candidateInterviewsController'),
    JobApplicationsController = require('../controllers/jobApplicationsController'),
    CardsDashboardController = require('../controllers/cardsDashboardController'),
    router = express.Router(),
    ccc = new ChallengeController(),
    cc = new CandidateController(),
    cic = new InterviewsController(),
    jac = new JobApplicationsController(),
    cdbc = new CardsDashboardController();

//    v1/candidates
router.get('/', middlewareAuth, authorization.isCurrentEmployer, cc.getAll.bind(cc));
router.head('/:dummy', cc.getAll.bind(cc));
router.get('/:candidate_id', middlewareAuth, authorization.isCurrentEmployerOrCurrentCandidate, cc.getById.bind(cc));
router.post('/', middlewareAuth, authorization.isCurrentEmployer, cc.create.bind(cc));
router.put('/:candidate_id', middlewareAuth, authorization.isCurrentEmployerOrCurrentCandidate, cc.update.bind(cc));
router.delete('/:candidate_id', middlewareAuth, authorization.isCurrentEmployerOrCurrentCandidate, cc.remove.bind(cc));

//    v1/candidates/candidate_id/challenges
router.get('/:candidate_id/challenges', middlewareAuth, authorization.isCurrentEmployerOrCurrentCandidate, ccc.getAll.bind(ccc));
router.get('/:candidate_id/challenges/:challenge_id', middlewareAuth, authorization.isCurrentEmployerOrCurrentCandidate, ccc.getById.bind(ccc));
router.post('/:candidate_id/challenges', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, function (req, res, next) {
    if (req && req.decoded) {
        authorization.isCurrentEmployerOrCurrentCandidate(req, res, next);
    } else {
        next();
    }
}, ccc.create.bind(ccc));
router.put('/:candidate_id/challenges/:challenge_id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, function (req, res, next) {
    if (req && req.decoded) {
        authorization.isCurrentEmployerOrCurrentCandidate(req, res, next);
    } else {
        next();
    }
}, ccc.update.bind(ccc));
router.delete('/:candidate_id/challenges/:challenge_id', middlewareAuth, authorization.isCurrentEmployerOrCurrentCandidate, ccc.remove.bind(ccc));

//    v1/candidates/id/interviews    // both employers and candidates
router.get('/:id/interviews', middlewareAuth, authorization.isSuperOrCurrentEmployerOrCurrentCandidate, cic.getAll.bind(cic));
router.get('/:id/interviews/:interview_id', middlewareAuth, authorization.isSuperOrCurrentEmployerOrCurrentCandidate, cic.getById.bind(cic));
router.get('/:id/shareInterviews/:interview_id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, function (req, res, next) {
    if (req && req.decoded) {
        authorization.isSuperOrCurrentEmployerOrCurrentCandidate(req, res, next);
    } else {
        next();
    }
}, cic.getById.bind(cic));
router.get('/:id/shareInterviews/details/:interview_id', cic.getById.bind(cic));

router.post('/:emp_id/interviews', middlewareAuth, authorization.isSuperOrCurrentEmployer, cic.create.bind(cic));
router.put('/:id/interviews/:interview_id', middlewareAuth, authorization.isSuperOrCurrentEmployerOrCurrentCandidate, cic.update.bind(cic));
router.delete('/:id/interviews/:interview_id', middlewareAuth, authorization.isSuper, cic.remove.bind(cic));

//    v1/candidates/public/:id
router.get('/public/:id', ccc.getById.bind(ccc));
router.put('/public/:id', authorization.isAppAuthenticated, ccc.update.bind(ccc));
router.put('/interviews/:id', authorization.isAppAuthenticated, cic.update.bind(cic));

//    v1/candidates/:candidate_id/jobs
router.get('/:candidate_id/jobs', middlewareAuth, authorization.isCurrentCandidate, jac.getAll.bind(jac));
router.get('/:candidate_id/jobs/:id', middlewareAuth, authorization.isCurrentCandidate, jac.getById.bind(jac));
router.post('/:candidate_id/jobs', middlewareAuth, authorization.isSuperOrCurrentCandidate, jac.create.bind(jac));
router.put('/:candidate_id/jobs/:id', middlewareAuth, authorization.isCurrentCandidate, jac.update.bind(jac));
router.delete('/:candidate_id/jobs/:id', middlewareAuth, authorization.isCurrentCandidate, jac.remove.bind(jac));

//    v1/candidates/:candidate_id/cards/:name
router.get('/:candidate_id/cards/:name', middlewareAuth, authorization.isCurrentCandidate, cdbc.getAll.bind(cdbc));

module.exports = router;
