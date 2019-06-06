var express = require('express'),
    router = express.Router(),
    AudioQuestionsController = require('../controllers/audioQuestionsController.js'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    aqc = new AudioQuestionsController();

router.get('/', aqc.getAll.bind(aqc));
router.get('/:id', aqc.getById.bind(aqc));
router.post('/', middlewareAuth, authorization.isSuper, aqc.create.bind(aqc));
router.put('/:id', middlewareAuth, authorization.isSuper, aqc.update.bind(aqc));
router.delete('/:id', middlewareAuth, authorization.isSuper, aqc.remove.bind(aqc));
module.exports = router;