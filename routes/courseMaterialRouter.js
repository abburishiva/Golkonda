var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseMaterialController = require('../controllers/courseMaterialController'),
    router = express.Router(),
    cm = new CourseMaterialController();

//  v1/course/materials
router.get('/', middlewareAuth, cm.getAll.bind(cm));
router.get('/:id', middlewareAuth, cm.getById.bind(cm));
router.post('/', middlewareAuth, cm.create.bind(cm));
router.put('/:id', middlewareAuth, cm.update.bind(cm));
router.delete('/:id', middlewareAuth, cm.remove.bind(cm));
module.exports = router;
