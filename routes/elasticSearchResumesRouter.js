var express = require('express'),
    router = express.Router(),
    ElasticSearchController = require('../controllers/elasticSearchResumesController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    esc = new ElasticSearchController();
//  /v1/resumes
router.get('/', esc.get.bind(esc));
router.get('/:id', middlewareAuth, esc.getById.bind(esc));
router.get('/:id/stats', middlewareAuth, esc.getById.bind(esc));
router.get('/:id/short_uid', esc.getById.bind(esc));
router.post('/', middlewareAuth, esc.create.bind(esc));
router.post('/search', middlewareAuth, esc.searchWithDetails.bind(esc));
router.post('/:id/feedback', middlewareAuth, esc.resumeFeedback.bind(esc));
router.put('/:id', middlewareAuth, esc.update.bind(esc));
router.delete('/:id', middlewareAuth, esc.remove.bind(esc));
router.get('/:id/timeline', middlewareAuth, esc.getTimeLineData.bind(esc));
module.exports = router;