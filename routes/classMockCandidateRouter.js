var express = require('express'),
    ClassMockCandidateController = require('../controllers/classMockCandidateController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cmc = new ClassMockCandidateController();

//   v1/class/mock/candidates
router.get('/', middlewareAuth, cmc.getAll.bind(cmc));
router.get('/:id', middlewareAuth, cmc.getById.bind(cmc));
router.post('/', middlewareAuth, cmc.create.bind(cmc));
router.put('/:id', middlewareAuth, cmc.update.bind(cmc));
router.delete('/:id', middlewareAuth, cmc.remove.bind(cmc));
module.exports = router;
