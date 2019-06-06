var express = require('express'),
    router = express.Router(),
    UserReviewsController = require('../controllers/userReviewsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    urc = new UserReviewsController();

//users/reviews
router.get('/', urc.getAll.bind(urc));
router.get('/:id', urc.getById.bind(urc));
router.post('/', middlewareAuth, urc.create.bind(urc));
router.put('/:id', middlewareAuth, urc.update.bind(urc));
router.delete('/:id', middlewareAuth, urc.remove.bind(urc));
module.exports = router;

