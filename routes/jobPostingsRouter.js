var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    JobPostingsController = require('../controllers/jobPostingsController'),
    router = express.Router(),
    jpc = new JobPostingsController();

//  /v1/jobs
router.get('/', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, jpc.get.bind(jpc));
router.get('/filter', jpc.getFilterDataCount.bind(jpc));
router.get('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, jpc.getById.bind(jpc));
router.post('/', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, function (req, res, next) {
    if (req && req.decoded) {
        authorization.isSuper(req, res, next);
    } else {
        next();
    }
}, jpc.create.bind(jpc));
router.put('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, function (req, res, next) {
    if (req && req.decoded) {
        authorization.isSuper(req, res, next);
    } else {
        next();
    }
}, jpc.update.bind(jpc));
router.delete('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, function (req, res, next) {
    if (req && req.decoded) {
        authorization.isSuper(req, res, next);
    } else {
        next();
    }
}, jpc.remove.bind(jpc));

module.exports = router;
