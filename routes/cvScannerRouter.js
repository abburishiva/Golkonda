var express = require('express'),
    cvUtil = require('../utils/cvScannerUtil'),
    multer = require('multer')(),
    router = express.Router(),
    cv = new cvUtil();


router.post('/', multer.single('resume'), cv.techWords.bind(cv));

module.exports = router;