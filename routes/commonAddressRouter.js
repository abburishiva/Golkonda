var express = require('express'),
    CommonAddressController = require('../controllers/commonAddressController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    router = express.Router(),
    ca = new CommonAddressController();

//  v1/common/addresses
router.get('/', ca.getAll.bind(ca));
router.get('/:id', ca.getById.bind(ca));
router.post('/', middlewareAuth, authorization.isSuper, ca.create.bind(ca));
router.put('/:id', middlewareAuth, authorization.isSuper, ca.update.bind(ca));
router.delete('/:id', middlewareAuth, authorization.isSuper, ca.remove.bind(ca));
module.exports = router;