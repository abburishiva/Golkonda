var express = require('express'),
    AppMgmtEmployeeController = require('../controllers/appMgmtEmployeeController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    amec = new AppMgmtEmployeeController();

//  v1/app/mgmt/employees
router.get('/', middlewareAuth, amec.getAll.bind(amec));
router.get('/:id', middlewareAuth, amec.getById.bind(amec));
router.post('/', middlewareAuth, amec.create.bind(amec));
router.put('/:id', middlewareAuth, amec.update.bind(amec));
router.delete('/:id', middlewareAuth, amec.remove.bind(amec));
module.exports = router;



