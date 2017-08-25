const express = require('express');
const router = express.Router();

const articleService = require('./services/article.service');

router.get('/', (req, res) => {
  articleService.getArticles(req, res);
});

router.post('/', (req, res) => {
  articleService.postArticle(req, res);
});

router.put('/:id', (req, res) => {
  articleService.putArticle(req, res);
});

router.delete('/:id', (req, res) => {
  articleService.deleteArticle(req, res);
});



module.exports = router;
