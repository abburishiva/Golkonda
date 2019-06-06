var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    AuthriseController = require('../controllers/authorizedController'),
    router = express.Router(),
    ac = new AuthriseController();

//   v1/authorize
router.post('/:name', middlewareAuth, ac.authorized.bind(ac));
module.exports = router;

