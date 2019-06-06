var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    EmployeeSubjectsController = require('../controllers/employerSubjectsController'),
    router = express.Router(),
    es = new EmployeeSubjectsController();

//   v1/employers_subjects
router.get('/', middlewareAuth, authorization.isSuper, es.getAll.bind(es));
router.get('/:emp_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.getById.bind(es));
router.post('/', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.create.bind(es));
router.put('/:emp_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.update.bind(es));
router.delete('/:emp_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.remove.bind(es));
module.exports = router;
