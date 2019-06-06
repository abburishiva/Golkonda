var express = require('express'),
    CommonCandidatePaperworkController = require('../controllers/commonCandidatePaperworkController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    ccpc = new CommonCandidatePaperworkController();

//   v1/common/candidate/paperworks
router.get('/', ccpc.getAll.bind(ccpc));
router.get('/:id', ccpc.getById.bind(ccpc));
router.post('/', middlewareAuth, authorization.isSuper, ccpc.create.bind(ccpc));
router.put('/:id', middlewareAuth, authorization.isSuper, ccpc.update.bind(ccpc));
router.delete('/:id', middlewareAuth, authorization.isSuper, ccpc.remove.bind(ccpc));
module.exports = router;
