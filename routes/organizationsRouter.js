var express = require('express'),
    router = express.Router(),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    OrganizationsController = require('../controllers/organizationsController'),
    oc = new OrganizationsController();

//  /v1/organizations
router.get('/', oc.getAll.bind(oc));
router.get('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, oc.getById.bind(oc));
router.post('/', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, oc.create.bind(oc));
router.put('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, oc.update.bind(oc));
router.delete('/:id', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, oc.remove.bind(oc));
module.exports = router;