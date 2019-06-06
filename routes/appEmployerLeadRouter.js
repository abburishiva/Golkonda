var express = require('express'),
    AppEmpLeadController = require('../controllers/appEmployerLeadController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    ael = new AppEmpLeadController();

//  v1/app/employer/leads
router.get('/', middlewareAuth, ael.getAll.bind(ael));
router.get('/:id', middlewareAuth, ael.getById.bind(ael));
router.post('/', middlewareAuth, ael.create.bind(ael));
router.put('/:id', middlewareAuth, ael.update.bind(ael));
router.delete('/:id', middlewareAuth, ael.remove.bind(ael));
module.exports = router;