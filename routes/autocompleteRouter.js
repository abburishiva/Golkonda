var express = require('express'),
    router = express.Router(),
    AutoCompleteController = require('../controllers/autocompleteController'),
    acc = new AutoCompleteController;

router.get('/', acc.getAll.bind(acc));

module.exports = router;