var express = require('express'),
    ClassQuestionsController = require('../controllers/classQuestionsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cqc = new ClassQuestionsController();

//  v1/class/questions
router.get('/', middlewareAuth, cqc.getAll.bind(cqc));
router.get('/:id', middlewareAuth, cqc.getById.bind(cqc));
router.post('/', middlewareAuth, cqc.create.bind(cqc));
router.put('/:id', middlewareAuth, cqc.update.bind(cqc));
router.delete('/:id', middlewareAuth, cqc.remove.bind(cqc));
module.exports = router;