var express = require('express'),
    WhiteBoardQuestionsController = require('../controllers/whiteBoardQuestionsController'),
    wqc = new WhiteBoardQuestionsController(),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router();

router.get('/', wqc.getAll.bind(wqc));
router.get('/:id', wqc.getById.bind(wqc));
router.post('/', middlewareAuth, authorization.isSuper, wqc.create.bind(wqc));
router.put('/:id', middlewareAuth, authorization.isSuper, wqc.update.bind(wqc));
router.delete('/:id', middlewareAuth, authorization.isSuper, wqc.remove.bind(wqc));
module.exports = router;