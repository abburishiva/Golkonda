var express = require('express'),
    LookupCountryController = require('../controllers/lookupCountryController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    lkc = new LookupCountryController();

//   v1/lookup/countries
router.get('/', lkc.getAll.bind(lkc));
router.get('/:id', lkc.getById.bind(lkc));
router.post('/', middlewareAuth, authorization.isSuper, lkc.create.bind(lkc));
router.put('/:id', middlewareAuth, authorization.isSuper, lkc.update.bind(lkc));
router.delete('/:id', middlewareAuth, authorization.isSuper, lkc.remove.bind(lkc));
module.exports = router;

