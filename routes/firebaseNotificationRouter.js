var express = require('express'),
    FirebaseNotificationCtrl = require('../controllers/firebaseNotificationController'),
    router = express.Router(),
    fnc = new FirebaseNotificationCtrl();

router.post('/subscriptions', fnc.createSubscription.bind(fnc));
router.post('/reminders', fnc.addReminder.bind(fnc));
router.post('/notifications', fnc.sendNotification.bind(fnc));
router.put('/notifications', fnc.updateNotification.bind(fnc));
router.delete('/notifications', fnc.deleteNotification.bind(fnc));
module.exports = router;
