var express = require('express'),
    router = express.Router(),
    RecordingslistBackupController = require('../controllers/recordingslistBackupController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    rlbc = new RecordingslistBackupController();

//recordinglist/backups
router.get('/', middlewareAuth, rlbc.getAll.bind(rlbc));
router.get('/:id', middlewareAuth, rlbc.getById.bind(rlbc));
router.post('/', middlewareAuth, rlbc.create.bind(rlbc));
router.put('/:id', middlewareAuth, rlbc.update.bind(rlbc));
router.delete('/:id', middlewareAuth, rlbc.remove.bind(rlbc));
module.exports = router;

