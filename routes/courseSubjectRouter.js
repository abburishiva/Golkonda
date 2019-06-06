var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseSubjectModel = require('../controllers/courseSubjectController'),
    router = express.Router(),
    csm = new CourseSubjectModel();

//  v1/course/subjects
router.get('/', middlewareAuth, csm.getAll.bind(csm));
router.get('/:id', middlewareAuth, csm.getById.bind(csm));
router.post('/', middlewareAuth, csm.create.bind(csm));
router.put('/:id', middlewareAuth, csm.update.bind(csm));
router.delete('/:id', middlewareAuth, csm.remove.bind(csm));
module.exports = router;

