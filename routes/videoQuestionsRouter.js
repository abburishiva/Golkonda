var express = require('express'),
    router = express.Router(),
    VideoQuestionController = require('../controllers/videoQuestionsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    cqc = new VideoQuestionController();

//video/questions
router.get('/', cqc.getAll.bind(cqc));
router.get('/:id', cqc.getById.bind(cqc));
router.post('/', middlewareAuth, authorization.isSuper, cqc.create.bind(cqc));
router.put('/:id', middlewareAuth, authorization.isSuper, cqc.update.bind(cqc));
router.delete('/:id', middlewareAuth, authorization.isSuper, cqc.remove.bind(cqc));
module.exports = router;