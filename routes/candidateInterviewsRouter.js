var express = require('express'),
    router = express.Router(),
    CandidateInterviewsController = require('../controllers/candidateInterviewsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    interviews = new CandidateInterviewsController();

router.get('/', middlewareAuth, authorization.isSuper, interviews.getAll.bind(interviews));
router.get('/:id', middlewareAuth, authorization.isSuper, interviews.getById.bind(interviews));
router.post('/', middlewareAuth, authorization.isSuper, interviews.create.bind(interviews));
router.put('/:id', middlewareAuth, authorization.isSuper, interviews.update.bind(interviews));
router.delete('/:id', middlewareAuth, authorization.isSuper, interviews.remove.bind(interviews));
module.exports = router;