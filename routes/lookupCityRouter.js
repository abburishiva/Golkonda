var express = require('express'),
    LookupCityController = require('../controllers/lookupCityController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    lc = new LookupCityController();

//    v1/lookup/cities
router.get('/', lc.getAll.bind(lc));
router.get('/:id', lc.getById.bind(lc));
router.post('/', middlewareAuth, authorization.isSuper, lc.create.bind(lc));
router.put('/:id', middlewareAuth, authorization.isSuper, lc.update.bind(lc));
router.delete('/:id', middlewareAuth, authorization.isSuper, lc.remove.bind(lc));
module.exports = router;
