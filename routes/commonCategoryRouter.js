var express = require('express'),
    CommonCategoryController = require('../controllers/commonCategoryController'),
    authorization = require('../utils/auth/authorization'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    cc = new CommonCategoryController();

//  v1/common/categories
router.get('/', cc.getAll.bind(cc));
router.get('/:id', cc.getById.bind(cc));
router.post('/', middlewareAuth, authorization.isSuper, cc.create.bind(cc));
router.put('/:id', middlewareAuth, authorization.isSuper, cc.update.bind(cc));
router.delete('/:id', middlewareAuth, authorization.isSuper, cc.remove.bind(cc));
module.exports = router;

