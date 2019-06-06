var express = require('express'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    EmployeeController = require('../controllers/employeeController'),
    EmployeeQuestionsController = require('../controllers/employeeQuestionsController'),
    EmployeeSubjectsController = require('../controllers/employerSubjectsController'),
    EmployeeChallengesController = require('../controllers/employeeChallengesController'),
    EmployerInterviewController = require('../controllers/employerInterviewsController'),
    JobPostingsController = require('../controllers/jobPostingsController'),
    CardsDashboardController = require('../controllers/cardsDashboardController'),
    router = express.Router(),
    ec = new EmployeeController(),
    eq = new EmployeeQuestionsController(),
    es = new EmployeeSubjectsController(),
    ecc = new EmployeeChallengesController(),
    eic = new EmployerInterviewController(),
    jpc = new JobPostingsController(),
    cdbc = new CardsDashboardController();

//   v1/employers
router.get('/', middlewareAuth, authorization.isSuper, ec.getAll.bind(ec));
router.get('/:emp_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, ec.getById.bind(ec));
router.post('/', middlewareAuth, authorization.isSuper, ec.create.bind(ec));
router.put('/:emp_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, ec.update.bind(ec));
router.delete('/:emp_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, ec.remove.bind(ec));

//  employers/emp_id/questions
router.get('/:emp_id/questions', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.getAll.bind(eq));
router.get('/:emp_id/questions/:question_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.getById.bind(eq));
router.post('/:emp_id/questions', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.create.bind(eq));
router.put('/:emp_id/questions/:question_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.update.bind(eq));
router.delete('/:emp_id/questions/:question_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eq.remove.bind(eq));

//  employers/emp_id/subjects
router.get('/:emp_id/subjects', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.getAll.bind(es));
router.get('/:emp_id/subjects/:subject_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.getById.bind(es));
router.post('/:emp_id/subjects', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.create.bind(es));
router.put('/:emp_id/subjects/:subject_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.update.bind(es));
router.delete('/:emp_id/subjects/:subject_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, es.remove.bind(es));

//  employers/emp_id/challenges
router.get('/:emp_id/challenges', middlewareAuth, authorization.isSuperOrCurrentEmployer, ecc.getAll.bind(ecc));
router.get('/:emp_id/challenges/:challenge_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, ecc.getById.bind(ecc));
router.post('/:emp_id/challenges', middlewareAuth, authorization.isSuperOrCurrentEmployer, ecc.create.bind(ecc));
router.put('/:emp_id/challenges/:challenge_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, ecc.update.bind(ecc));
router.delete('/:emp_id/challenges/:challenge_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, ecc.remove.bind(ecc));

//  employers/get/public/challenges  // getting new public challenges only
router.get('/get/:candidate_id/public/challenges', eic.getAll.bind(eic));
router.get('/get/:candidate_id/public/challenges/:challenge_id', eic.getById.bind(eic));


//   employers/emp_id/interviews
router.get('/:emp_id/interviews', middlewareAuth, authorization.isSuperOrCurrentEmployer, eic.getAll.bind(eic));
router.get('/:emp_id/interviews/:interview_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eic.getById.bind(eic));
router.post('/:emp_id/interviews', middlewareAuth, authorization.isSuperOrCurrentEmployer, eic.create.bind(eic));
router.put('/:emp_id/interviews/:interview_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eic.update.bind(eic));
router.delete('/:emp_id/interviews/:interview_id', middlewareAuth, authorization.isSuperOrCurrentEmployer, eic.remove.bind(eic));

//employers/emp_id/jobs
router.get('/:emp_id/jobs', middlewareAuth, authorization.isSuperOrCurrentEmployer, jpc.get.bind(jpc));
router.get('/:emp_id/jobs/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, jpc.getById.bind(jpc));
router.post('/:emp_id/jobs', middlewareAuth, authorization.isSuperOrCurrentEmployer, jpc.create.bind(jpc));
router.put('/:emp_id/jobs/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, jpc.update.bind(jpc));
router.delete('/:emp_id/jobs/:id', middlewareAuth, authorization.isSuperOrCurrentEmployer, jpc.remove.bind(jpc));

//  v1/employers/:emp_id/cards/:name
router.get('/:emp_id/cards/:name', middlewareAuth, authorization.isSuperOrCurrentEmployer, cdbc.getAll.bind(cdbc));

module.exports = router;
