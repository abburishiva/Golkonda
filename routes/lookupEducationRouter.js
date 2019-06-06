var express = require('express'),
    router = express.Router(),
    LookupEducationController = require('../controllers/lookupEducationController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    lec = new LookupEducationController();

///lookup/education/levels
router.get('/', lec.getAll.bind(lec));
router.get('/:id', lec.getById.bind(lec));
router.post('/', middlewareAuth, authorization.isSuper, lec.create.bind(lec));
router.put('/:id', middlewareAuth, authorization.isSuper, lec.update.bind(lec));
router.delete('/:id', middlewareAuth, authorization.isSuper, lec.remove.bind(lec));
module.exports = router;

