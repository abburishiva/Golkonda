var express = require('express'),
    router = express.Router(),
    CacheDeletionController = require('../controllers/cacheDeletionController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    cdc = new CacheDeletionController();

router.post('/', middlewareAuth, authorization.isSuper, cdc.remove.bind(cdc));
module.exports = router;
