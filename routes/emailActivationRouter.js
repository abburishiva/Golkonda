var express = require('express'),
    router = express.Router(),
    EmailActivationController = require('../controllers/emailActivationController'),
    emailActivation = new EmailActivationController();

router.post('/', emailActivation.emailActivation.bind(emailActivation));
module.exports = router;