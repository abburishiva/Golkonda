var express = require('express'),
    router = express.Router(),
    PublicReviewsController = require('../controllers/userPublicReviewsController'),
    prc = new PublicReviewsController();

//users/public/reviews
router.get('/', prc.get.bind(prc));
module.exports = router;

