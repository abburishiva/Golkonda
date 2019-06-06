var express = require('express'),
    router = express.Router(),
    LookupCurrenciesController = require('../controllers/lookupCurrenciesController.js'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    lccc = new LookupCurrenciesController();

//lookup/country/currencies
router.get('/', lccc.getAll.bind(lccc));
router.get('/:id', lccc.getById.bind(lccc));
router.post('/', middlewareAuth, authorization.isSuper, lccc.create.bind(lccc));
router.put('/:id', middlewareAuth, authorization.isSuper, lccc.update.bind(lccc));
router.delete('/:id', middlewareAuth, authorization.isSuper, lccc.remove.bind(lccc));
module.exports = router;