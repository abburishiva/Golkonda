/*jslint unparam: true*/
var express = require('express'),
    router = express.Router();
router.get('/', function (req, res, next) {
    res.send('This is talentscreen version one');
});
router.use('/user/authenticate', require('./loginRouter'));
router.use('/user/register', require('./registerRouter'));
router.use('/codeverification', require('./codeverificationRouter'));
router.use('/user/forgotpassword', require('./forgotPasswordRouter'));
router.use('/emailactivation', require('./emailActivationRouter'));

router.use('/app/positions', require('./appPositionRouter'));
router.use('/app/employers', require('./appEmployerRouter'));
router.use('/app/employer/agencies', require('./appEmployerAgencyRouter'));
router.use('/app/employer/contacts', require('./appEmployerContactRouter'));
router.use('/app/employer/leads', require('./appEmployerLeadRouter'));
router.use('/app/mgmt/companies', require('./appMgmtCompanyRouter'));
router.use('/app/mgmt/employees', require('./appMgmtEmployeeRouter'));
router.use('/authorize', require('./authorizedRouter'));

router.use('/candidates', require('./candidateRouter'));
router.use('/courses', require('./courseRouter'));
router.use('/candidate/assignments', require('./candidateAssignmentRouter'));
router.use('/candidate/questions', require('./candidateQuestionRouter'));
router.use('/candidate/quiz/details', require('./candidateQuizDetailsRouter'));
router.use('/challenges', require('./challengesRouter'));
router.use('/choice/questions', require('./choiceQuestionsRouter'));
router.use('/class/questions', require('./classQuestionsRouter'));
router.use('/class/assignments', require('./classAssignmentRouter'));
router.use('/class/mocks', require('./classMockRouter'));
router.use('/class/mock/candidates', require('./classMockCandidateRouter'));
router.use('/class/notes', require('./classNotesRouter'));
router.use('/class/recordings', require('./classRecordingRouter'));
router.use('/coding/questions', require('./codingQuestionsRouter'));
router.use('/typed/questions', require('./typedQuestionsRouter'));
router.use('/compiler', require('./codeCompilerRouter'));
router.use('/common/addresses', require('./commonAddressRouter'));
router.use('/common/categories', require('./commonCategoryRouter'));
router.use('/common/entities', require('./commonEntityRouter'));
router.use('/common/levels', require('./commonLevelRouter'));
router.use('/common/statuses', require('./commonStatusRouter'));
router.use('/common/roles', require('./commonRoleRouter'));
router.use('/common/types', require('./commonTypeRouter'));
router.use('/common/values', require('./commonValuesRouter'));
router.use('/common/employees', require('./commonEmployeeRouter'));
router.use('/common/contacts', require('./commonContactRouter'));
router.use('/common/companies', require('./commonCompanyRouter'));
router.use('/common/candidates', require('./commonCandidateRouter'));
router.use('/common/email/accounts', require('./commonEmailAccountRouter'));
router.use('/common/paperworks', require('./commonPaperworkRouter'));
router.use('/common/candidate/paperworks', require('./commonCandidatePaperworkRouter'));
router.use('/contact/feedbacks', require('./contactFeedbackRouter'));
router.use('/course/materials', require('./courseMaterialRouter'));
router.use('/course/faqs', require('./courseFaqRouter'));
router.use('/course/demos', require('./courseDemoRouter'));
router.use('/course/schedules', require('./courseScheduleRouter'));
router.use('/course/contents', require('./courseContentRouter'));
router.use('/course/batches', require('./courseBatchRouter'));
router.use('/course/subjects', require('./courseSubjectRouter'));
router.use('/course/testimonials', require('./courseTestimonialRouter'));

router.use('/employers', require('./employeeRouter'));
router.use('/employers_challenges', require('./employeeChallengesRouter'));
router.use('/employers_questions', require('./employeeQuestionsRouter'));
router.use('/employers_subjects', require('./employerSubjectsRouter'));
router.use('/employers_interviews', require('./employerInterviewsRouter'));

router.use('/google_api',require('./googleApiRouter'));

router.use('/infra/email-message', require('./emailEngineRouter'));

router.use('/lead/sources', require('./leadSourceRouter'));
router.use('/lookup/education/levels', require('./lookupEducationRouter'));
router.use('/lookup/designations', require('./lookupDesignationsRouter'));
router.use('/lookup/salaryunits', require('./lookupSalaryUnitRouter'));
router.use('/lookup/countries', require('./lookupCountryRouter'));
router.use('/lookup/work/statuses', require('./lookupWorkStatusRouter'));
router.use('/lookup/cities', require('./lookupCityRouter'));
router.use('/lookup/universities', require('./lookupUniversityRouter'));
router.use('/lookup/industries', require('./lookupIndustriesRouter'));
router.use('/lookup/currencies', require('./lookupCountryCurrenciesRouter'));

router.use('/mkt/candidate/assignments', require('./mktCandidateAssignmentRouter'));
router.use('/mkt/candidates', require('./mktCandidateRouter'));
router.use('/mkt/candidate/leads', require('./mktCandidateLeadRouter'));

router.use('/questions', require('./questionsRouter'));

router.use('/app/quizzes', require('./quizzesRouter'));
router.use('/analytics_question',require('./analyticsQuestionRouter'));
router.use('/rec/candidates', require('./recCandidateRouter'));
router.use('/rec/candidate/leads', require('./recCandidateLeadRouter'));
router.use('/rec/candidate/logins', require('./recCandidateLoginRouter'));
router.use('/rec/candidate/login/history', require('./recCandidateLoginHistoryRouter'));
router.use('/recordinglist/backups', require('./recordingslistBackupRouter'));

router.use('/subjects', require('./subjectRouter'));
router.use('/search', require('./searchRouter'));
router.use('/share', require('./shareResumeRouter'));

router.use('/resumes', require('./elasticSearchResumesRouter'));
router.use('/resume/requests', require('./resumeRequestsRouter'));
router.use('/users/reviews', require('./userReviewsRouter'));
router.use('/users/public/reviews', require('./userPublicReviewsRouter'));
router.use('/user/github/login', require('./userLoginGithubRouter'));
router.use('/user/history/login', require('./userLoginHistoryRouter'));
router.use('/user/login/history/invalid', require('./userLoginHistoryInvalidRouter'));
router.use('/user/facebook/login', require('./userLoginFacebookRouter'));
router.use('/user/login/linkedin', require('./userLoginLinkedinRouter'));
router.use('/user/google/login', require('./userLoginGoogleRouter'));
router.use('/user/roles', require('./userRoleRouter'));
router.use('/user/login', require('./userLoginRouter'));
router.use('/cache/load', require('./cacheLoadRouter'));
router.use('/video/questions', require('./videoQuestionsRouter'));
router.use('/video', require('./videoUploadRouter'));
router.use('/resume/permissions', require('./resumePermissionsRouter'));
router.use('/common/terms', require('./commonTermsRouter'));
router.use('/cache/deletion', require('./cacheDeletionRouter'));
router.use('/candidates_interviews', require('./candidateInterviewsRouter'));
router.use('/whiteboard/questions', require('./whiteBoardQuestionsRouter'));
router.use('/audio/questions', require('./audioQuestionsRouter.js'));
router.use('/notify', require('./notificationEngineRouter'));
router.use('/firebase', require('./firebaseNotificationRouter'));
router.use('/tech/scanner', require('./cvScannerRouter'));
router.use('/skills', require('./skillsRouter'));
router.use('/app/quizzes', require('./quizzesRouter'));
router.use('/news_letter', require('./newsLetterRouter'));
router.use('/static_questions', require('./staticQuestionsRouter'));
router.use('/organizations', require('./organizationsRouter'));
router.use('/jobs', require('./jobPostingsRouter'));
router.use('/jobapplications', require('./jobApplicationsRouter'));
router.use('/cards', require('./cardsDashboardRouter'));
router.use('/autocomplete', require('./autocompleteRouter'));
router.use('/categories', require('./categoriesRouter'));
router.use('/lookup/country/currencies', require('./lookupCurrenciesRouter'));
router.use('/job_help_requests', require('./jobHelpRequestsRouter'));
module.exports = router;
