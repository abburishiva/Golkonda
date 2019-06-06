var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    CourseScheduleController = require('../controllers/courseScheduleController'),
    router = express.Router(),
    cc = new CourseScheduleController();

//  v1/course/schedules
router.get('/', middlewareAuth, cc.getAll.bind(cc));
router.get('/:id', middlewareAuth, cc.getById.bind(cc));
router.post('/', middlewareAuth, cc.create.bind(cc));
router.put('/:id', middlewareAuth, cc.update.bind(cc));
router.delete('/:id', middlewareAuth, cc.remove.bind(cc));
module.exports = router;