var express = require('express'),
    NotificationEngineController = require('../controllers/notificationEngineController'),
    router = express.Router(),
    ne = new NotificationEngineController();

router.post('/', ne.create.bind(ne));
router.post('/unsubscribe/user', ne.unSubscribe.bind(ne));
module.exports = router;