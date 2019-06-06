var LookupCountryModel = require('../models/mysqlModels/lookupCountryModel'),
    LookupCityModel = require('../models/mysqlModels/lookupCityModel'),
    LookupEducationModel = require('../models/mysqlModels/lookupEducationModel'),
    LookupDesignationsModel = require('../models/mysqlModels/lookupDesignationsModel'),
    LookupEmpSalaryUnitModel = require('../models/mysqlModels/lookupSalaryUnitModel'),
    LookupWorkStatusModel = require('../models/mysqlModels/lookupWorkStatusModel'),
    LookupIndustriesModel = require('../models/mysqlModels/lookupIndustriesModel'),
    LeadSourceModel = require('../models/mysqlModels/leadSourceModel'),
    ClassRecordingModel = require('../models/mysqlModels/classRecordingModel'),
    RecordinglistBackupModel = require('../models/mysqlModels/recordingslistBackupModel'),
    ClassNotesModel = require('../models/mysqlModels/classNotesModel'),
    CourseDemoModel = require('../models/mysqlModels/courseDemoModel'),
    CourseMaterialModel = require('../models/mysqlModels/courseMaterialModel'),
    CourseFaqModel = require('../models/mysqlModels/courseFaqModel'),
    CourseContentModel = require('../models/mysqlModels/courseContentModel'),
    CourseBatchModel = require('../models/mysqlModels/courseBatchModel'),
    CourseScheduleModel = require('../models/mysqlModels/courseScheduleModel'),
    CourseSubjectModel = require('../models/mysqlModels/courseSubjectModel'),
    CourseTestimonialModel = require('../models/mysqlModels/courseTestimonialModel'),
    CourseModel = require('../models/mysqlModels/courseModel'),
    ClassAssignmentModel = require('../models/mysqlModels/classAssignmentModel'),
    ClassQuestionsModel = require('../models/mysqlModels/classQuestionsModel'),
    ClassMockModel = require('../models/mysqlModels/classMockModel'),
    ClassMockCandidateModel = require('../models/mysqlModels/classMockCandidateModel'),
    CandidateAssignmentModel = require('../models/mysqlModels/candidateAssignmentModel'),
    CandidateQuestionModel = require('../models/mysqlModels/candidateQuestionModel'),
    MktCandidateAssignmentModel = require('../models/mysqlModels/mktCandidateAssignmentModel'),
    MktCandidateLeadModel = require('../models/mysqlModels/mktCandidateLeadModel'),
    CommonCategoryModel = require('../models/mysqlModels/commonCategoryModel'),
    CommonCandidateModel = require('../models/mysqlModels/commonCandidateModel'),
    CommonEmailAccountModel = require('../models/mysqlModels/commonEmailAccountModel'),
    CommonLevelModel = require('../models/mysqlModels/commonLevelModel'),
    CommonRoleModel = require('../models/mysqlModels/commonRoleModel'),
    CommonStatusModel = require('../models/mysqlModels/commonStatusModel'),
    CommonAddressModel = require('../models/mysqlModels/commonAddressModel'),
    CommonTypeModel = require('../models/mysqlModels/commonTypeModel'),
    CommonEntityModel = require('../models/mysqlModels/commonEntityModel'),
    CommonEmployeeModel = require('../models/mysqlModels/commonEmployeeModel'),
    CommonContactModel = require('../models/mysqlModels/commonContactModel'),
    RecCandidateLoginModel = require('../models/mysqlModels/recCandidateLoginModel'),
    RecCandidateModel = require('../models/mysqlModels/recCandidateModel'),
    RecCandidateLeadModel = require('../models/mysqlModels/recCandidateLeadModel'),
    UserLoginGoogleModel = require('../models/mysqlModels/userLoginGoogleModel'),
    UserLoginGithubModel = require('../models/mysqlModels/userLoginGithubModel'),
    UserLoginLinkedinModel = require('../models/mysqlModels/userLoginLinkedinModel'),
    UserLoginFacebookModel = require('../models/mysqlModels/userLoginFacebookModel'),
    UserLoginHistoryModel = require('../models/mysqlModels/userLoginHistoryModel'),
    UserLoginModel = require('../models/mysqlModels/userLoginModel'),
    UserLoginHistoryInvalidModel = require('../models/mysqlModels/userLoginHistoryInvalidModel'),
    SubjectModel = require('../models/mysqlModels/subjectModel'),
    CommonCompanyModel = require('../models/mysqlModels/commonCompanyModel'),
    MktCandidateModel = require('../models/mysqlModels/mktCandidateModel'),
    AppEmployerModel = require('../models/mysqlModels/appEmployerModel'),
    AppEmployerAgencyModel = require('../models/mysqlModels/appEmployerAgencyModel'),
    AppEmployerLeadModel = require('../models/mysqlModels/appEmployerLeadModel'),
    AppEmployerContactModel = require('../models/mysqlModels/appEmployerContactModel'),
    AppPositionModel = require('../models/mysqlModels/appPositionModel'),
    UserRoleModel = require('../models/mysqlModels/userRoleModel'),
    ChoiceQuestionsModel = require('../models/mysqlModels/choiceQuestionsModel'),
    CodingQuestionsModel = require('../models/mysqlModels/codingQuestionsModel'),
    VideoQuestionsModel = require('../models/mysqlModels/videoQuestionsModel'),
    lem,
    lkm,
    ledm,
    lesu,
    lws,
    lsm,
    crm,
    rlbm,
    cdc,
    cm,
    cf,
    cc,
    cbm,
    csc,
    ctm,
    cs,
    cac,
    cqm,
    cmm,
    cmc,
    cassi,
    cq,
    mca,
    ccat,
    clev,
    cr,
    cst,
    ct,
    centi,
    rcl,
    ulg,
    ulgit,
    subj,
    ccomp,
    lcity,
    mc,
    coa,
    ccont,
    ull,
    ulf,
    ulh,
    ulhi,
    cem,
    ccandi,
    aem,
    aea,
    ael,
    cn,
    csub,
    urm,
    ulm,
    mcanl,
    reccan,
    reccl,
    chqm,
    cdq,
    vqm,
    ceam,
    aecont,
    li,
    apm;
function SearchController() {
    subj = new SubjectModel();
    mc = new MktCandidateModel();
    lcity = new LookupCityModel();
    lem = new LookupEducationModel();
    lkm = new LookupCountryModel();
    ledm = new LookupDesignationsModel();
    lesu = new LookupEmpSalaryUnitModel();
    lws = new LookupWorkStatusModel();
    lsm = new LeadSourceModel();
    crm = new ClassRecordingModel();
    rlbm = new RecordinglistBackupModel();
    cn = new ClassNotesModel();
    cdc = new CourseDemoModel();
    cm = new CourseMaterialModel();
    cf = new CourseFaqModel();
    cc = new CourseContentModel();
    cbm = new CourseBatchModel();
    csc = new CourseScheduleModel();
    ctm = new CourseTestimonialModel();
    cs = new CourseModel();
    cac = new ClassAssignmentModel();
    cqm = new ClassQuestionsModel();
    cmm = new ClassMockModel();
    cmc = new ClassMockCandidateModel();
    cassi = new CandidateAssignmentModel();
    cq = new CandidateQuestionModel();
    mca = new MktCandidateAssignmentModel();
    ccat = new CommonCategoryModel();
    clev = new CommonLevelModel();
    cr = new CommonRoleModel();
    cst = new CommonStatusModel();
    ct = new CommonTypeModel();
    centi = new CommonEntityModel();
    rcl = new RecCandidateLoginModel();
    ulg = new UserLoginGoogleModel();
    ulgit = new UserLoginGithubModel();
    ccomp = new CommonCompanyModel();
    coa = new CommonAddressModel();
    ccont = new CommonContactModel();
    ull = new UserLoginLinkedinModel();
    ulf = new UserLoginFacebookModel();
    ulh = new UserLoginHistoryModel();
    ulhi = new UserLoginHistoryInvalidModel();
    cem = new CommonEmployeeModel();
    ccandi = new CommonCandidateModel();
    aem = new AppEmployerModel();
    aea = new AppEmployerAgencyModel();
    ael = new AppEmployerLeadModel();
    csub = new CourseSubjectModel();
    urm = new UserRoleModel();
    ulm = new UserLoginModel();
    mcanl = new MktCandidateLeadModel();
    reccan = new RecCandidateModel();
    reccl = new RecCandidateLeadModel();
    chqm = new ChoiceQuestionsModel();
    cdq = new CodingQuestionsModel();
    vqm = new VideoQuestionsModel();
    ceam = new CommonEmailAccountModel();
    aecont = new AppEmployerContactModel();
    apm = new AppPositionModel();
    li = new LookupIndustriesModel();
}
SearchController.prototype.get = function (req, res, next) {
    if (req.params.searchName === 'countries') {
        lkm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'appcontacts') {
        aecont.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'positions') {
        apm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'accounts') {
        ceam.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'reccandidates') {
        reccan.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'choicequestions') {
        chqm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'videoquestions') {
        vqm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'codingquestions') {
        cdq.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'recleads') {
        reccl.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'mktleads') {
        mcanl.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'userlogin') {
        ulm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'cities') {
        lcity.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'workstatus') {
        lws.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'facebook') {
        ulf.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'history') {
        ulh.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'companies') {
        ccomp.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'candidates') {
        ccandi.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'employers') {
        aem.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'agencies') {
        aea.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'leads') {
        ael.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'linkedins') {
        ull.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'addresses') {
        coa.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'contacts') {
        ccont.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }

    if (req.params.searchName === 'coursesubjects') {
        csub.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'subjects') {
        subj.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'education') {
        lem.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'types') {
        ct.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'entities') {
        centi.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'levels') {
        lem.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'invalid') {
        ulhi.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'google') {
        ulg.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'commonlevels') {
        clev.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'github') {
        ulgit.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'status') {
        cst.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'roles') {
        cr.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'userroles') {
        urm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'notes') {
        cn.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'categories') {
        ccat.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'employees') {
        cem.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'login') {
        rcl.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'designations') {
        ledm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                if(data.length > 0){
                    res.json(data);
                } else
                    res.status(204).json({status: 204, message: 'No Content'});
            }
        });
    }
    if (req.params.searchName === 'demos') {
        cdc.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'contents') {
        cc.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'batches') {
        cbm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'schedules') {
        csc.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'courses') {
        cs.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'faqs') {
        cf.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'testimonials') {
        ctm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'assignments') {
        cac.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'questions') {
        cqm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'mocks') {
        cmm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'mockcandidates') {
        cmc.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'materials') {
        cm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'sources') {
        lsm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'recordings') {
        crm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'candidateassignments') {
        cassi.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'candidatequestions') {
        cq.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'mktassignments') {
        mca.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'mktcandidates') {
        mc.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'backups') {
        rlbm.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'salaryunits') {
        lesu.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'status') {
        cs.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
    if (req.params.searchName === 'industries') {
        li.search(req.query, function (err, data) {
            if (err) {
                return next(err);
            }
            if (data.length === 1) {
                res.json(data[0]);
            } else {
                res.json(data);
            }
        });
    }
};
module.exports = SearchController;

