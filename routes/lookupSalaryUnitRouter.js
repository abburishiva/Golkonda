var express = require('express'),
    router = express.Router(),
    LookupEmpSalaryUnitController = require('../controllers/lookupSalaryUnitController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    lesc = new LookupEmpSalaryUnitController();

//lookup/employee/salaryunits
router.get('/', lesc.getAll.bind(lesc));
router.get('/:id', lesc.getById.bind(lesc));
router.post('/', middlewareAuth, authorization.isSuper, lesc.create.bind(lesc));
router.put('/:id', middlewareAuth, authorization.isSuper, lesc.update.bind(lesc));
router.delete('/:id', middlewareAuth, authorization.isSuper, lesc.remove.bind(lesc));
module.exports = router;
