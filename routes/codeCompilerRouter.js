var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    CodeCompilerController = require('../controllers/codeCompilerController'),
    router = express.Router(),
    cc = new CodeCompilerController();

//      v1/compiler
router.get('/', cc.getAll.bind(cc));
router.get('/:id', cc.getById.bind(cc));
router.delete('/:id', middlewareAuth, authorization.isSuper, cc.remove.bind(cc));
router.post('/', middlewareAuth, authorization.isSuper, cc.create.bind(cc));
router.put('/:id', middlewareAuth, authorization.isSuper, cc.update.bind(cc));
router.post('/processes', cc.compile.bind(cc));
module.exports = router;
