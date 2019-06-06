var express = require('express'),
    CommonTypeController = require('../controllers/commonTypeController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    ct = new CommonTypeController();

//   v1/common/types
router.get('/', ct.getAll.bind(ct));
router.get('/:id', ct.getById.bind(ct));
router.post('/', middlewareAuth, authorization.isSuper, ct.create.bind(ct));
router.put('/:id', middlewareAuth, authorization.isSuper, ct.update.bind(ct));
router.delete('/:id', middlewareAuth, authorization.isSuper, ct.remove.bind(ct));
module.exports = router;


