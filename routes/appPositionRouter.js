var express = require('express'),
    AppPositionController = require('../controllers/appPositionController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    apc = new AppPositionController();

//  v1/app/positions
router.get('/', middlewareAuth, apc.getAll.bind(apc));
router.get('/:id', middlewareAuth, apc.getById.bind(apc));
router.post('/', middlewareAuth, apc.create.bind(apc));
router.put('/:id', middlewareAuth, apc.update.bind(apc));
router.delete('/:id', middlewareAuth, apc.remove.bind(apc));
module.exports = router;