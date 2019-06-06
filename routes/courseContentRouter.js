var express = require('express'),
    CourseContentController = require('../controllers/courseContentController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    ccc = new CourseContentController();

//  v1/course/contents
router.get('/', middlewareAuth, ccc.getAll.bind(ccc));
router.get('/:id', middlewareAuth, ccc.getById.bind(ccc));
router.post('/', middlewareAuth, ccc.create.bind(ccc));
router.put('/:id', middlewareAuth, ccc.update.bind(ccc));
router.delete('/:id', middlewareAuth, ccc.remove.bind(ccc));
module.exports = router;
