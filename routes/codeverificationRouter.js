var express = require('express'),
    router = express.Router(),
    CodeVerificationController = require('../controllers/codeVerificationController'),
    codeVerification = new CodeVerificationController();

router.post('/', codeVerification.codeVerification.bind(codeVerification));
module.exports = router;

