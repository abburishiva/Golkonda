var express = require('express'),
    router = express.Router(),
    CacheloadController = require('../controllers/cacheLoadController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    cl = new CacheloadController();

router.get('/', cl.get.bind(cl));
router.get('/:id', cl.getById.bind(cl));
router.post('/', middlewareAuth, authorization.isSuper, cl.create.bind(cl));
router.put('/:id', middlewareAuth, authorization.isSuper, cl.update.bind(cl));
router.delete('/:id', middlewareAuth, authorization.isSuper, cl.remove.bind(cl));
module.exports = router;