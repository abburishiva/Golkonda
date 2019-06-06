var express = require('express'),
    router = express.Router(),
    EmpInterviews = require('../controllers/employerInterviewsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    ei = new EmpInterviews();

//  /v1/employers_interviews
router.get('/', middlewareAuth, authorization.isSuper, ei.getAll.bind(ei));
router.get('/:id', middlewareAuth, authorization.isSuper, ei.getById.bind(ei));
router.post('/', middlewareAuth, authorization.isSuper, ei.create.bind(ei));
router.put('/:id', middlewareAuth, authorization.isSuper, ei.update.bind(ei));
router.delete('/:id', middlewareAuth, authorization.isSuper, ei.remove.bind(ei));
router.get('/:id/positions', middlewareAuth, ei.positions.bind(ei));
module.exports = router;