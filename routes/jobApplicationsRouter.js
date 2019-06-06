var express = require('express'),
    router = express.Router(),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    JobApplicationsController = require('../controllers/jobApplicationsController'),
    jac = new JobApplicationsController();

//  /v1/jobapplications
router.get('/',function (req, res, next) {
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
}, jac.getAll.bind(jac));
router.get('/:id',function (req, res, next) {
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
}, jac.getById.bind(jac));
router.post('/',function (req, res, next) {
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
}, jac.create.bind(jac));
router.put('/:id',function (req, res, next) {
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
}, jac.update.bind(jac));
router.delete('/:id',function (req, res, next) {
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
}, jac.remove.bind(jac));
module.exports = router;
