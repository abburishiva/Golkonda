var express = require('express'),
    CandidateQuestionController = require('../controllers/candidateQuestionController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cq = new CandidateQuestionController();

//   v1/candidate/questions
router.get('/', middlewareAuth, cq.getAll.bind(cq));
router.get('/:id', middlewareAuth, cq.getById.bind(cq));
router.post('/', middlewareAuth, cq.create.bind(cq));
router.put('/:id', middlewareAuth, cq.update.bind(cq));
router.delete('/:id', middlewareAuth, cq.remove.bind(cq));
module.exports = router;
