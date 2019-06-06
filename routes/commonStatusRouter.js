var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    CommonStatusController = require('../controllers/commonStatusController'),
    router = express.Router(),
    cs = new CommonStatusController();

//   v1/common/status
router.get('/', cs.getAll.bind(cs));
router.get('/:id', cs.getById.bind(cs));
router.post('/', middlewareAuth, authorization.isSuper, cs.create.bind(cs));
router.put('/:id', middlewareAuth, authorization.isSuper, cs.update.bind(cs));
router.delete('/:id', middlewareAuth, authorization.isSuper, cs.remove.bind(cs));
module.exports = router;



