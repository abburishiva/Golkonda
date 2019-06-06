var express = require('express'),
    router = express.Router(),
    UserRoleController = require('../controllers/userRoleController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ur = new UserRoleController();

//user/roles
router.get('/', middlewareAuth, ur.getAll.bind(ur));
router.get('/:id', middlewareAuth, ur.getById.bind(ur));
router.post('/', middlewareAuth, ur.create.bind(ur));
router.put('/:id', middlewareAuth, ur.update.bind(ur));
router.delete('/:id', middlewareAuth, ur.remove.bind(ur));
module.exports = router;

