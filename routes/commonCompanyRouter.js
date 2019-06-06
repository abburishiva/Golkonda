var express = require('express'),
    CommonCompaniesController = require('../controllers/commonCompanyController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    cc = new CommonCompaniesController();

//  v1/common/companies
router.get('/', cc.getAll.bind(cc));
router.get('/:id', cc.getById.bind(cc));
router.post('/', middlewareAuth, authorization.isSuper, cc.create.bind(cc));
router.put('/:id', middlewareAuth, authorization.isSuper, cc.update.bind(cc));
router.delete('/:id', middlewareAuth, authorization.isSuper, cc.remove.bind(cc));
module.exports = router;

