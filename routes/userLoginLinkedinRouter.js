var express = require('express'),
    router = express.Router(),
    UserLoginLinkedinController = require('../controllers/userLoginLinkedinController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ullc = new UserLoginLinkedinController();

//user/login/linkedin
router.get('/', middlewareAuth, ullc.getAll.bind(ullc));
router.get('/:id', middlewareAuth, ullc.getById.bind(ullc));
router.post('/', middlewareAuth, ullc.create.bind(ullc));
router.put('/:id', middlewareAuth, ullc.update.bind(ullc));
router.delete('/:id', middlewareAuth, ullc.remove.bind(ullc));
module.exports = router;



