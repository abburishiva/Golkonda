var express = require('express'),
    CommonRoleController = require('../controllers/commonRoleController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    cr = new CommonRoleController();

//  v1/common/roles
router.get('/', cr.getAll.bind(cr));
router.get('/:id', cr.getById.bind(cr));
router.post('/', middlewareAuth, authorization.isSuper, cr.create.bind(cr));
router.put('/:id', middlewareAuth, authorization.isSuper, cr.update.bind(cr));
router.delete('/:id', middlewareAuth, authorization.isSuper, cr.remove.bind(cr));
module.exports = router;


