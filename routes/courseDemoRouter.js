var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseDemoController = require('../controllers/courseDemoController'),
    router = express.Router(),
    cdc = new CourseDemoController();

//   v1/course/demos
router.get('/', middlewareAuth, cdc.getAll.bind(cdc));
router.get('/:id', middlewareAuth, cdc.getById.bind(cdc));
router.post('/', middlewareAuth, cdc.create.bind(cdc));
router.put('/:id', middlewareAuth, cdc.update.bind(cdc));
router.delete('/:id', middlewareAuth, cdc.remove.bind(cdc));
module.exports = router;
