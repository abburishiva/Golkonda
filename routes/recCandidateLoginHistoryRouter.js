var express = require('express'),
    router = express.Router(),
    RecCandidateLoginHistoryController = require('../controllers/recCandidateLoginHistoryController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    rclhc = new RecCandidateLoginHistoryController();

//rec/candidate/login/history
router.get('/', middlewareAuth, rclhc.getAll.bind(rclhc));
router.get('/:id', middlewareAuth, rclhc.getById.bind(rclhc));
router.post('/', middlewareAuth, rclhc.create.bind(rclhc));
router.put('/:id', middlewareAuth, rclhc.update.bind(rclhc));
router.delete('/:id', middlewareAuth, rclhc.remove.bind(rclhc));
module.exports = router;

