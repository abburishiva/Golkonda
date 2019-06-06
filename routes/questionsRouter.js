var express = require('express'),
    router = express.Router(),
    middlewareAuth = require('../utils/auth/middleAuth'),
    QuestionsController = require('../controllers/questionsController'),
    authorization = require('../utils/auth/authorization'),
    qc = new QuestionsController();

//questions
router.get('/', qc.getAll.bind(qc));
router.get('/:id', qc.getById.bind(qc));
router.post('/', middlewareAuth, authorization.isSuper, qc.create.bind(qc));
router.put('/:id', middlewareAuth, authorization.isSuper, qc.update.bind(qc));
router.delete('/:id', middlewareAuth, authorization.isSuper, qc.remove.bind(qc));
module.exports = router;

