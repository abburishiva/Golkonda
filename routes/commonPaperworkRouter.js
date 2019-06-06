var express = require('express'),
    CommonPaperworkController = require('../controllers/commonPaperworkController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    cpw = new CommonPaperworkController();

//   v1/common/paperworks
router.get('/', cpw.getAll.bind(cpw));
router.get('/:id', cpw.getById.bind(cpw));
router.post('/', middlewareAuth, authorization.isSuper, cpw.create.bind(cpw));
router.put('/:id', middlewareAuth, authorization.isSuper, cpw.update.bind(cpw));
router.delete('/:id', middlewareAuth, authorization.isSuper, cpw.remove.bind(cpw));
module.exports = router;

