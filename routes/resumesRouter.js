var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    upload = multer(),
    ResumesController = require('../controllers/resumesController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    rc = new ResumesController();

//resumes
router.post('/', middlewareAuth, upload.single('resume'), rc.create.bind(rc));
module.exports = router;
