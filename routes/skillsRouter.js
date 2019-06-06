var express = require('express'),
    router = express.Router(),
    skillsController = require('../controllers/skillsController'),
    middlewareAuth = require('../utils/auth/middleAuth'),
    authorization = require('../utils/auth/authorization'),
    sc = new skillsController();

// v1/skills
router.get('/',sc.getAll.bind(sc));
router.get('/:id',sc.getById.bind(sc));
router.post('/',  middlewareAuth, authorization.isSuper,sc.create.bind(sc));
router.put('/:id',  middlewareAuth, authorization.isSuper,sc.update.bind(sc));
router.delete('/:id',  middlewareAuth, authorization.isSuper,sc.remove.bind(sc));

module.exports = router;