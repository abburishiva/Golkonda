var express = require('express'),
    router = express.Router(),
    JobHelpRequestsController = require('../controllers/jobHelpRequestsController'),
    jwt = require('jsonwebtoken'),
    jhrc = new JobHelpRequestsController();

//  /v1//job_help_requests
router.get('/', jhrc.getAll.bind(jhrc));
router.get('/:id', jhrc.getById.bind(jhrc));
router.post('/', jhrc.create.bind(jhrc));
router.post('/login', jhrc.login.bind(jhrc));
router.put('/:id',function (req,res,next) {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'TalentJobHelpRequests', function (err, decoded) {
            if (err) {
                res.status(401).json({success: false, status: 401, message: 'Authentication Is Failed.'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}, jhrc.update.bind(jhrc));
router.delete('/:id', function (req,res,next) {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'TalentJobHelpRequests', function (err, decoded) {
            if (err) {
                res.status(401).json({success: false, status: 401, message: 'Authentication Is Failed.'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}, jhrc.remove.bind(jhrc));

module.exports = router;
