var express = require('express'),
    router = express.Router(),
    MktCandidateLeadController = require('../controllers/mktCandidateLeadController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    mclc = new MktCandidateLeadController();

///mkt/candidate/leads
router.get('/', middlewareAuth, mclc.getAll.bind(mclc));
router.get('/:id', middlewareAuth, mclc.getById.bind(mclc));
router.post('/', middlewareAuth, mclc.create.bind(mclc));
router.put('/:id', middlewareAuth, mclc.update.bind(mclc));
router.delete('/:id', middlewareAuth, mclc.remove.bind(mclc));
module.exports = router;


