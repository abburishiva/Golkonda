var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseController = require('../controllers/courseController'),
    router = express.Router(),
    cs = new CourseController();

//  v1/courses
router.get('/', middlewareAuth, cs.getAll.bind(cs));
router.get('/:id', middlewareAuth, cs.getById.bind(cs));
router.post('/', middlewareAuth, cs.create.bind(cs));
router.put('/:id', middlewareAuth, cs.update.bind(cs));
router.delete('/:id', middlewareAuth, cs.remove.bind(cs));
module.exports = router;






