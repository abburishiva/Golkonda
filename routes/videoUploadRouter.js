var express = require('express'),
    multer = require('multer'),
    router = express.Router(),
    UserRoleController = require('../controllers/videoUploadController'),
    authorization = require('../utils/auth/authorization'),
    ur = new UserRoleController(),
    upload = multer(),
    middlewareAuth = require('../utils/auth/middleAuth');

//  v1/video
router.post('/:name', function (req, res, next) {
    if (req.headers && req.headers['x-access-key']) {
        return authorization.isAppAuthenticated(req, res, next);
    }
    middlewareAuth(req, res, next);
}, upload.single('video'), ur.upload.bind(ur));
module.exports = router;
