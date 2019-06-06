var express = require('express'),
    CandidateQuizDetailsController = require('../controllers/candidateQuizDetailsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cqdc = new CandidateQuizDetailsController();

//    v1/candidate/quiz/details
router.get('/', middlewareAuth, cqdc.getAll.bind(cqdc));
router.get('/:id', middlewareAuth, cqdc.getById.bind(cqdc));
router.post('/', middlewareAuth, cqdc.create.bind(cqdc));
router.put('/:id', middlewareAuth, cqdc.update.bind(cqdc));
router.delete('/:id', middlewareAuth, cqdc.remove.bind(cqdc));
module.exports = router;

