var express = require('express'),
    ClassNotesController = require('../controllers/classNotesController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    router = express.Router(),
    clnc = new ClassNotesController();

//   v1/class/notes
router.get('/', middlewareAuth, clnc.getAll.bind(clnc));
router.get('/:id', middlewareAuth, clnc.getById.bind(clnc));
router.post('/', middlewareAuth, clnc.create.bind(clnc));
router.put('/:id', middlewareAuth, clnc.update.bind(clnc));
router.delete('/:id', middlewareAuth, clnc.remove.bind(clnc));
module.exports = router;

