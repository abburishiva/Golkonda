var express = require('express'),
    router = express.Router(),
    ForgotPasswordController = require('../controllers/forgotPasswordController'),
    forgotPassword = new ForgotPasswordController();

router.post('/', forgotPassword.resetPassword.bind(forgotPassword));
module.exports = router;