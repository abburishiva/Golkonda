var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    EmployeeChallengesController = require('../controllers/employeeChallengesController'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    cc = new EmployeeChallengesController();

//   v1/employers/challenges
router.get('/', middlewareAuth, authorization.isSuper, cc.getAll.bind(cc));
router.get('/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, cc.getById.bind(cc));
router.post('/', middlewareAuth, authorization.isSuperOrCurrentEmployer, cc.create.bind(cc));
router.put('/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, cc.update.bind(cc));
router.delete('/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, cc.remove.bind(cc));
module.exports = router;
