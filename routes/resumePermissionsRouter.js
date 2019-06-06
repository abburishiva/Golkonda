var express = require('express'),
    router = express.Router(),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ResumePermissionController = require('../controllers/resumePermissionsController'),
    rp = new ResumePermissionController();
// /v1/resume/permissions
router.get('/', middlewareAuth, rp.getAll.bind(rp));
router.get('/:resumeId/getPermissions', middlewareAuth, rp.getById.bind(rp));
router.get('/:email', middlewareAuth, rp.getById.bind(rp));
router.get('/email/permissions', middlewareAuth, authorization.isSuperOrCurrentEmployerOrCurrentCandidate, rp.getAll.bind(rp));
router.post('/', middlewareAuth, rp.create.bind(rp));
router.put('/:id', middlewareAuth, rp.update.bind(rp));
router.delete('/:id', middlewareAuth, rp.remove.bind(rp));
module.exports = router;
