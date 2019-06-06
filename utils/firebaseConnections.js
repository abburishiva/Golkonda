var admin = require("firebase-admin"),
    config = require('.././config/config.json'),
    app = admin.initializeApp({
        credential: admin.credential.cert(config.dev.firebase_connections.serviceAcountKey),
        databaseURL: config.dev.firebase_connections.databaseURL
    });
module.exports.reminderNotifications = admin.database().ref('reminderNotifications/');
module.exports.onSiteNotifications = admin.database().ref('onSiteNotifications/');
module.exports.subscriptions = admin.database().ref('subscriptions/');
module.exports.config = app;

