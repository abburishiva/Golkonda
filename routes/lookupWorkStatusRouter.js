var express = require('express'),
    router = express.Router(),
    LookupWorkStatusController = require('../controllers/lookupWorkStatusController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    lwc = new LookupWorkStatusController();

//lookup/work/statuses
router.get('/', lwc.getAll.bind(lwc));
router.get('/:id', lwc.getById.bind(lwc));
router.post('/', middlewareAuth, authorization.isSuper, lwc.create.bind(lwc));
router.put('/:id', middlewareAuth, authorization.isSuper, lwc.update.bind(lwc));
router.delete('/:id', middlewareAuth, authorization.isSuper, lwc.remove.bind(lwc));
module.exports = router;
