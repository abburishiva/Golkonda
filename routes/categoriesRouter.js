var express = require('express'),
    router = express.Router(),
    categoriesController = require('../controllers/categoriesController'),
    cc = new categoriesController;

router.get('/', cc.getAll.bind(cc));

module.exports = router;