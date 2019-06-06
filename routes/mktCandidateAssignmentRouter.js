var express = require('express'),
    router = express.Router(),
    MktCandidateAssignmentController = require('../controllers/mktCandidateAssignmentController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    mca = new MktCandidateAssignmentController();

//mkt/candidate/assignments
router.get('/', middlewareAuth, mca.getAll.bind(mca));
router.get('/:id', middlewareAuth, mca.getById.bind(mca));
router.post('/', middlewareAuth, mca.create.bind(mca));
router.put('/:id', middlewareAuth, mca.update.bind(mca));
router.delete('/:id', middlewareAuth, mca.remove.bind(mca));
module.exports = router;
