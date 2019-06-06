var express = require('express'),
    ClassMockController = require('../controllers/classMockController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cmm = new ClassMockController();

//   v1/class/mocks
router.get('/', middlewareAuth, cmm.getAll.bind(cmm));
router.get('/:id', middlewareAuth, cmm.getById.bind(cmm));
router.post('/', middlewareAuth, cmm.create.bind(cmm));
router.put('/:id', middlewareAuth, cmm.update.bind(cmm));
router.delete('/:id', middlewareAuth, cmm.remove.bind(cmm));
module.exports = router;
