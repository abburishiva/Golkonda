var express = require('express'),
    router = express.Router(),
    UserLoginController = require('../controllers/userLoginController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ul = new UserLoginController();

//user/login
router.get('/', middlewareAuth, ul.getAll.bind(ul));
router.get('/:id', middlewareAuth, ul.getById.bind(ul));
router.post('/', middlewareAuth, ul.create.bind(ul));
router.put('/:id', middlewareAuth, ul.update.bind(ul));
router.delete('/:id', middlewareAuth, ul.remove.bind(ul));
module.exports = router;
