var express = require('express'),
    router = express.Router(),
    middlewareAuth = require('../utils/auth/middleAuth'),
    NewsLetterController = require('../controllers/newsLetterController'),
    news = new NewsLetterController();

router.get('/', middlewareAuth, news.getAll.bind(news));
router.get('/:id', middlewareAuth, news.getById.bind(news));
router.post('/', middlewareAuth, news.create.bind(news));
router.put('/:id', middlewareAuth, news.update.bind(news));
router.delete('/:id', middlewareAuth, news.remove.bind(news));

module.exports = router;