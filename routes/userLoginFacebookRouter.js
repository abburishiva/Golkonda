var express = require('express'),
    router = express.Router(),
    UserLoginFacebookController = require('../controllers/userLoginFacebookController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ulfc = new UserLoginFacebookController();

//user/facebook/login
router.get('/', middlewareAuth, ulfc.getAll.bind(ulfc));
router.get('/:id', middlewareAuth, ulfc.getById.bind(ulfc));
router.post('/', middlewareAuth, ulfc.create.bind(ulfc));
router.put('/:id', middlewareAuth, ulfc.update.bind(ulfc));
router.delete('/:id', middlewareAuth, ulfc.remove.bind(ulfc));
module.exports = router;
