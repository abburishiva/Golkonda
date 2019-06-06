var express = require('express'),
    router = express.Router(),
    CommonValuesController = require('../controllers/commonValuesController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    cv = new CommonValuesController();

router.get('/', cv.getAll.bind(cv));
router.get('/:id', cv.getById.bind(cv));
router.post('/', middlewareAuth, authorization.isSuper, cv.create.bind(cv));
router.put('/:id', middlewareAuth, authorization.isSuper, cv.update.bind(cv));
router.delete('/:id', middlewareAuth, authorization.isSuper, cv.remove.bind(cv));
module.exports = router;


