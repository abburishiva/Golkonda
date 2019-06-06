var express = require('express'),
    CommonLevelController = require('../controllers/commonLevelController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cl = new CommonLevelController();

//  v1/common/levels
router.get('/', cl.getAll.bind(cl));
router.get('/:id', cl.getById.bind(cl));
router.post('/', middlewareAuth, authorization.isSuper, cl.create.bind(cl));
router.put('/:id', middlewareAuth, authorization.isSuper, cl.update.bind(cl));
router.delete('/:id', middlewareAuth, authorization.isSuper, cl.remove.bind(cl));
module.exports = router;

