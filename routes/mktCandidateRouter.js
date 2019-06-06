var express = require('express'),
    router = express.Router(),
    MktCandidateController = require('../controllers/mktCandidateController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    mcc = new MktCandidateController();

//mkt/candidates
router.get('/', middlewareAuth, mcc.getAll.bind(mcc));
router.get('/:id', middlewareAuth, mcc.getById.bind(mcc));
router.post('/', middlewareAuth, mcc.create.bind(mcc));
router.put('/:id', middlewareAuth, mcc.update.bind(mcc));
router.delete('/:id', middlewareAuth, mcc.remove.bind(mcc));
module.exports = router;


