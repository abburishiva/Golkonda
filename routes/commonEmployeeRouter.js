var express = require('express'),
    CommonEmployeeController = require('../controllers/commonEmployeeController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    ce = new CommonEmployeeController();

//  v1/common/employees
router.get('/', ce.getAll.bind(ce));
router.get('/:id', ce.getById.bind(ce));
router.post('/', middlewareAuth, authorization.isSuper, ce.create.bind(ce));
router.put('/:id', middlewareAuth, authorization.isSuper, ce.update.bind(ce));
router.delete('/:id', middlewareAuth, authorization.isSuper, ce.remove.bind(ce));
module.exports = router;
