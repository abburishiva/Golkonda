var express = require('express'),
    router = express.Router(),
    SearchController = require('../controllers/shareResumesController'),
    sc = new SearchController();

router.get('/:id', sc.getById.bind(sc));
module.exports = router;
