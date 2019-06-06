var express = require('express'),
    ClassRecordingController = require('../controllers/classRecordingController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cr = new ClassRecordingController();

//  v1/class/recordings
router.get('/', middlewareAuth, cr.getAll.bind(cr));
router.get('/:id', middlewareAuth, cr.getById.bind(cr));
router.post('/', middlewareAuth, cr.create.bind(cr));
router.put('/:id', middlewareAuth, cr.update.bind(cr));
router.delete('/:id', middlewareAuth, cr.remove.bind(cr));
module.exports = router;

