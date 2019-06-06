var express = require('express'),
    router = express.Router(),
    LoginController = require('../controllers/loginController'),
    authorization = require('../utils/auth/authorization'),
    loginControl = new LoginController();

router.post('/', loginControl.authenticate.bind(loginControl));
router.post('/:type', authorization.isAppAuthenticated, loginControl.login.bind(loginControl));
module.exports = router;