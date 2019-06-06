var express = require('express'),
    router = express.Router(),
    SearchController = require('../controllers/searchController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    sc = new SearchController();

router.get('/:searchName', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, sc.get.bind(sc));
module.exports = router;
