var express = require('express'),
    router = express.Router(),
    lookupIndustriesController = require('../controllers/lookupIndustriesController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    indc = new lookupIndustriesController();


router.get('/', indc.getAll.bind(indc));
router.get('/:id', indc.getById.bind(indc));
router.post('/', middlewareAuth, authorization.isSuper, indc.create.bind(indc));
router.put('/:id', middlewareAuth, authorization.isSuper, indc.update.bind(indc));
router.delete('/:id', middlewareAuth, authorization.isSuper, indc.remove.bind(indc));

module.exports = router;
