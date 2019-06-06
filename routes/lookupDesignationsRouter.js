var express = require('express'),
    router = express.Router(),
    LookupEmpDesignationController = require('../controllers/lookupDesignationsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    ledc = new LookupEmpDesignationController();

//lookup/employee/designations
router.get('/', ledc.getAll.bind(ledc));
router.get('/:id', ledc.getById.bind(ledc));
router.post('/', middlewareAuth, authorization.isSuper, ledc.create.bind(ledc));
router.put('/:id', middlewareAuth, authorization.isSuper, ledc.update.bind(ledc));
router.delete('/:id', middlewareAuth, authorization.isSuper, ledc.remove.bind(ledc));
module.exports = router;
