var express = require('express'),
    ContactFeedbackController = require('../controllers/contactFeedbackController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cfc = new ContactFeedbackController();

//   v1/contact/feedbacks
router.get('/', middlewareAuth, cfc.getAll.bind(cfc));
router.get('/:id', middlewareAuth, cfc.getById.bind(cfc));
router.post('/', middlewareAuth, cfc.create.bind(cfc));
router.put('/:id', middlewareAuth, cfc.update.bind(cfc));
router.delete('/:id', middlewareAuth, cfc.remove.bind(cfc));
module.exports = router;


