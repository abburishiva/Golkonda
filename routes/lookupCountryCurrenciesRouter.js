var express = require('express'),
    router = express.Router(),
    lookupCountryCurrenciesController = require('../controllers/lookupCountryCurrenciesController.js'),
    lccc = new lookupCountryCurrenciesController();

//lookup/country/currencies

router.get('/', lccc.getAll.bind(lccc));
module.exports = router;