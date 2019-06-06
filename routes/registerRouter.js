var express = require('express'),
    router = express.Router(),
    RegisterController = require('../controllers/registerController'),
    userRegister = new RegisterController();

router.post('/', userRegister.register.bind(userRegister));
module.exports = router;