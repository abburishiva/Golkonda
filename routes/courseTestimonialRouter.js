var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseTestimonialController = require('../controllers/courseTestimonialController'),
    router = express.Router(),
    ctc = new CourseTestimonialController();

//   v1/course/testimonials
router.get('/', middlewareAuth, ctc.getAll.bind(ctc));
router.get('/:id', middlewareAuth, ctc.getById.bind(ctc));
router.post('/', middlewareAuth, ctc.create.bind(ctc));
router.put('/:id', middlewareAuth, ctc.update.bind(ctc));
router.delete('/:id', middlewareAuth, ctc.remove.bind(ctc));
module.exports = router;

