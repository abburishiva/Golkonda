var express = require('express'),
    TypedQuestionController = require('../controllers/typedQuestionsController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    tqc = new TypedQuestionController(),
    router = express.Router();

router.get('/', tqc.getAll.bind(tqc));
router.get('/:id', tqc.getById.bind(tqc));
router.post('/', middlewareAuth, authorization.isSuper, tqc.create.bind(tqc));
router.put('/:id', middlewareAuth, authorization.isSuper, tqc.update.bind(tqc));
router.delete('/:id', middlewareAuth, authorization.isSuper, tqc.remove.bind(tqc));
module.exports = router;