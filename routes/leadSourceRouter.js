var express = require('express'),
    LeadSourceController = require('../controllers/leadSourceController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    lsc = new LeadSourceController();

//    v1/lead/sources
router.get('/', middlewareAuth, lsc.getAll.bind(lsc));
router.get('/:id', middlewareAuth, lsc.getById.bind(lsc));
router.post('/', middlewareAuth, lsc.create.bind(lsc));
router.put('/:id', middlewareAuth, lsc.update.bind(lsc));
router.delete('/:id', middlewareAuth, lsc.remove.bind(lsc));
module.exports = router;

