var express = require('express'),
    AppEmployerContactController = require('../controllers/appEmployerContactController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    aecc = new AppEmployerContactController();

//  v1/app/employer/contacts
router.get('/', middlewareAuth, aecc.getAll.bind(aecc));
router.get('/:id', middlewareAuth, aecc.getById.bind(aecc));
router.post('/', middlewareAuth, aecc.create.bind(aecc));
router.put('/:id', middlewareAuth, aecc.update.bind(aecc));
router.delete('/:id', middlewareAuth, aecc.remove.bind(aecc));
module.exports = router;

