var express = require('express'),
    EmailEngineController = require('../controllers/emailEngineController'),
    router = express.Router(),
    ee = new EmailEngineController();

//   /v1/infra/email-message
router.post('/', ee.create.bind(ee));
module.exports = router;