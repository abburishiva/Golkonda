var express = require('express'),
    CommonCandidateController = require('../controllers/commonCandidateController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    cc = new CommonCandidateController();

//   v1/common/candidates
router.get('/', cc.getAll.bind(cc));
router.get('/:id', cc.getById.bind(cc));
router.post('/', middlewareAuth, authorization.isSuper, cc.create.bind(cc));
router.put('/:id', middlewareAuth, authorization.isSuper, cc.update.bind(cc));
router.delete('/:id', middlewareAuth, authorization.isSuper, cc.remove.bind(cc));
module.exports = router;