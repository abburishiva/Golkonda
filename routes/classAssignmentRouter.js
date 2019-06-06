var express = require('express'),
    ClassAssignmentController = require('../controllers/classAssignmentController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cac = new ClassAssignmentController();

//  v1/class/assignments
router.get('/', middlewareAuth, cac.getAll.bind(cac));
router.get('/:id', middlewareAuth, cac.getById.bind(cac));
router.post('/', middlewareAuth, cac.create.bind(cac));
router.put('/:id', middlewareAuth, cac.update.bind(cac));
router.delete('/:id', middlewareAuth, cac.remove.bind(cac));
module.exports = router;
