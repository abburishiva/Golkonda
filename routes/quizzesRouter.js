var express = require('express'),
    router = express.Router(),
    QuizzesController = require('../controllers/quizzesController'),
    qzc = new QuizzesController();


router.get('/:quiztype/subjects', qzc.getAll.bind(qzc));

router.get('/:quiztype/subjects/:subjectid/levels', qzc.getAll.bind(qzc));

module.exports = router;




