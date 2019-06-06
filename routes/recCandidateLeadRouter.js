var express = require('express'),
    router = express.Router(),
    RecCandidateLeadController = require('../controllers/recCandidateLeadController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    rcl = new RecCandidateLeadController();

///rec/candidate/leads
router.get('/', middlewareAuth, rcl.getAll.bind(rcl));
router.get('/:id', middlewareAuth, rcl.getById.bind(rcl));
router.post('/', middlewareAuth, rcl.create.bind(rcl));
router.put('/:id', middlewareAuth, rcl.update.bind(rcl));
router.delete('/:id', middlewareAuth, rcl.remove.bind(rcl));
module.exports = router;

