var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseFaqController = require('../controllers/courseFaqController'),
    router = express.Router(),
    cfc = new CourseFaqController();

//   v1/course/faqs
router.get('/', middlewareAuth, cfc.getAll.bind(cfc));
router.get('/:id', middlewareAuth, cfc.getById.bind(cfc));
router.post('/', middlewareAuth, cfc.create.bind(cfc));
router.put('/:id', middlewareAuth, cfc.update.bind(cfc));
router.delete('/:id', middlewareAuth, cfc.remove.bind(cfc));
module.exports = router;
