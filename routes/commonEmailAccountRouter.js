var express = require('express'),
    CommonEmailAccountController = require('../controllers/commonEmailAccountController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    cea = new CommonEmailAccountController();

//  v1/common/email/accounts
router.get('/', cea.getAll.bind(cea));
router.get('/:id', cea.getById.bind(cea));
router.post('/', middlewareAuth, authorization.isSuper, cea.create.bind(cea));
router.put('/:id', middlewareAuth, authorization.isSuper, cea.update.bind(cea));
router.delete('/:id', middlewareAuth, authorization.isSuper, cea.remove.bind(cea));
module.exports = router;

