var express = require('express'),
    CourseBatchController = require('../controllers/courseBatchController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cbm = new CourseBatchController();

//  v1/course/batches
router.get('/', middlewareAuth, cbm.getAll.bind(cbm));
router.get('/:id', middlewareAuth, cbm.getById.bind(cbm));
router.post('/', middlewareAuth, cbm.create.bind(cbm));
router.put('/:id', middlewareAuth, cbm.update.bind(cbm));
router.delete('/:id', middlewareAuth, cbm.remove.bind(cbm));
module.exports = router;
