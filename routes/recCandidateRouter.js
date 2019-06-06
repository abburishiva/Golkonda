var express = require('express'),
    router = express.Router(),
    RecCandidateController = require('../controllers/recCandidateController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    rcc = new RecCandidateController();

//rec/candidates
router.get('/', middlewareAuth, rcc.getAll.bind(rcc));
router.get('/:id', middlewareAuth, rcc.getById.bind(rcc));
router.post('/', middlewareAuth, rcc.create.bind(rcc));
router.put('/:id', middlewareAuth, rcc.update.bind(rcc));
router.delete('/:id', middlewareAuth, rcc.remove.bind(rcc));
module.exports = router;

