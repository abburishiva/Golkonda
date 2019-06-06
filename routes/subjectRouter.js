var express = require('express'),
    router = express.Router(),
    SubjectController = require('../controllers/subjectController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    sub = new SubjectController();

//subjects
router.get('/', sub.getAll.bind(sub));
router.get('/:id', sub.getById.bind(sub));
router.post('/', middlewareAuth, authorization.isSuper, sub.create.bind(sub));
router.put('/:id', middlewareAuth, authorization.isSuper, sub.update.bind(sub));
router.delete('/:id', middlewareAuth, authorization.isSuper, sub.remove.bind(sub));
module.exports = router;
