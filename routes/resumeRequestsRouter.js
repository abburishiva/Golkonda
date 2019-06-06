var express = require('express'),
    router = express.Router(),
    ResumeRequestsController = require('../controllers/resumeRequestsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    rr = new ResumeRequestsController();

// /v1/resume/requests
router.get('/',middlewareAuth,rr.getAll.bind(rr));
router.get('/:id',middlewareAuth,rr.getById.bind(rr));
router.post('/',middlewareAuth,rr.create.bind(rr));
router.put('/:id',middlewareAuth,rr.update.bind(rr));
router.delete('/:id',middlewareAuth,rr.remove.bind(rr));
module.exports = router;
