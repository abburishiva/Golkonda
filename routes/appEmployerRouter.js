var express = require('express'),
    AppEmployerController = require('../controllers/appEmployerController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    aec = new AppEmployerController();

//  v1/app/employers
router.get('/', middlewareAuth, aec.getAll.bind(aec));
router.get('/:id', middlewareAuth, aec.getById.bind(aec));
router.post('/', middlewareAuth, aec.create.bind(aec));
router.put('/:id', middlewareAuth, aec.update.bind(aec));
router.delete('/:id', middlewareAuth, aec.remove.bind(aec));
module.exports = router;