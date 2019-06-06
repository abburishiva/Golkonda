var express = require('express'),
    AppEmployerAgencyController = require('../controllers/appEmployerAgencyController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    aeac = new AppEmployerAgencyController();

//  v1/app/employer/agencies
router.get('/', middlewareAuth, aeac.getAll.bind(aeac));
router.get('/:id', middlewareAuth, aeac.getById.bind(aeac));
router.post('/', middlewareAuth, aeac.create.bind(aeac));
router.put('/:id', middlewareAuth, aeac.update.bind(aeac));
router.delete('/:id', middlewareAuth, aeac.remove.bind(aeac));
module.exports = router;
