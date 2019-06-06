var express = require('express'),
    router = express.Router(),
    middlewareAuth = require('../utils/auth/middleAuth'),
    GoogleApiController = require('./../controllers/googleApiController'),
    gac = new GoogleApiController();

router.get('/', middlewareAuth, gac.getAll.bind(gac));

module.exports = router;