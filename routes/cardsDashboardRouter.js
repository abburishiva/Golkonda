var express = require('express'),
    router = express.Router(),
    CardsDashboardController = require('../controllers/cardsDashboardController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    cdc = new CardsDashboardController();

router.get('/', middlewareAuth, cdc.getAll.bind(cdc));

module.exports = router;
