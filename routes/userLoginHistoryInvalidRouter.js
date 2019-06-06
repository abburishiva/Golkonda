var express = require('express'),
    router = express.Router(),
    UserLoginHistoryInvalidController = require('../controllers/userLoginHistoryInvalidController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    ulhic = new UserLoginHistoryInvalidController();

//user/login/history/invalid
router.get('/', middlewareAuth, ulhic.getAll.bind(ulhic));
router.get('/:id', middlewareAuth, ulhic.getById.bind(ulhic));
router.post('/', middlewareAuth, ulhic.create.bind(ulhic));
router.put('/:id', middlewareAuth, ulhic.update.bind(ulhic));
router.delete('/:id', middlewareAuth, ulhic.remove.bind(ulhic));
module.exports = router;

