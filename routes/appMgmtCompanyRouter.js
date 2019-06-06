var express = require('express'),
    AppMgmtCompanyController = require('../controllers/appMgmtCompanyController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    amcc = new AppMgmtCompanyController();

//  v1/app/mgmt/companies
router.get('/', middlewareAuth, amcc.getAll.bind(amcc));
router.get('/:id', middlewareAuth, amcc.getById.bind(amcc));
router.post('/', middlewareAuth, amcc.create.bind(amcc));
router.put('/:id', middlewareAuth, amcc.update.bind(amcc));
router.delete('/:id', middlewareAuth, amcc.remove.bind(amcc));
module.exports = router;


