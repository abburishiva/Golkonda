var express = require('express'),
    router = express.Router(),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    LookupUniversityController = require('../controllers/lookupUniversityController'),
    lc = new LookupUniversityController();

///lookup/universities
router.get('/', lc.getAll.bind(lc));
router.get('/:id', lc.getById.bind(lc));
router.post('/', middlewareAuth, authorization.isSuper, lc.create.bind(lc));
router.put('/:id', middlewareAuth, authorization.isSuper, lc.update.bind(lc));
router.delete('/:id', middlewareAuth, authorization.isSuper, lc.remove.bind(lc));
module.exports = router;

