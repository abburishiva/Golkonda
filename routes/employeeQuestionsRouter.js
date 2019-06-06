var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    EmployeeQuestionsController = require('../controllers/employeeQuestionsController'),
    router = express.Router(),
    eq = new EmployeeQuestionsController();

//  v1/employers/questions
router.get('/', middlewareAuth, authorization.isSuper, eq.getAll.bind(eq));
router.get('/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.getById.bind(eq));
router.post('/', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.create.bind(eq));
router.put('/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.update.bind(eq));
router.delete('/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.remove.bind(eq));
module.exports = router;
