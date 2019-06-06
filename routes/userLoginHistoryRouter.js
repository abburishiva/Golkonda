var express = require('express'),
    router = express.Router(),
    UserLoginHistoryController = require('../controllers/userLoginHistoryController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ulh = new UserLoginHistoryController();

//user/history/login
router.get('/', middlewareAuth, ulh.getAll.bind(ulh));
router.get('/:id', middlewareAuth, ulh.getById.bind(ulh));
router.post('/', middlewareAuth, ulh.create.bind(ulh));
router.put('/:id', middlewareAuth, ulh.update.bind(ulh));
router.delete('/:id', middlewareAuth, ulh.remove.bind(ulh));
module.exports = router;

