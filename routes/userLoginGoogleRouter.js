var express = require('express'),
    router = express.Router(),
    UserLoginGoogleController = require('../controllers/userLoginGoogleController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ulg = new UserLoginGoogleController();

//user/google/login
router.get('/', middlewareAuth, ulg.getAll.bind(ulg));
router.get('/:id', middlewareAuth, ulg.getById.bind(ulg));
router.post('/', middlewareAuth, ulg.create.bind(ulg));
router.put('/:id', middlewareAuth, ulg.update.bind(ulg));
router.delete('/:id', middlewareAuth, ulg.remove.bind(ulg));
module.exports = router;

