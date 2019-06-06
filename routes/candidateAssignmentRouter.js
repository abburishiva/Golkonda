var express = require('express'),
    CandidateAssignmentController = require('../controllers/candidateAssignmentController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cacc = new CandidateAssignmentController();

//   v1/candidate/assignments
router.get('/', middlewareAuth, cacc.getAll.bind(cacc));
router.get('/:id', middlewareAuth, cacc.getById.bind(cacc));
router.post('/', middlewareAuth, cacc.create.bind(cacc));
router.put('/:id', middlewareAuth, cacc.update.bind(cacc));
router.delete('/:id', middlewareAuth, cacc.remove.bind(cacc));
module.exports = router;
