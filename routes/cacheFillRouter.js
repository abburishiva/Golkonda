var express = require('express'),
    router = express.Router(),
    CacheFillController = require('../utils/cache/cacheFillUtil'),
    cfc = new CacheFillController();

router.get('/', cfc.cacheFill.bind(cfc));
module.exports = router;