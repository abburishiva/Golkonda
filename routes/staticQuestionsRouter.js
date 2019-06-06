var express = require('express'),
    router = express.Router(),
    StaticQuestionsController = require('../controllers/staticQuestionsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
     stq = new StaticQuestionsController();

//  v1/StaticQuestions

router.get('/', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    } else {
        next();
    }
}, stq.getAll.bind(stq));
router.get('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    } else {
        next();
    }

}, stq.getById.bind(stq));
router.post('/', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    } else {
        next();
    }
}, stq.create.bind(stq));
router.put('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    } else {
        next();
    }

}, stq.update.bind(stq));
router.delete('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    } else {
        next();
    }

}, stq.remove.bind(stq));

module.exports = router;



