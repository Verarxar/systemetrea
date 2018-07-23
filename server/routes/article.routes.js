var express = require('express');
var router = express.Router();

const services = require('../services');
const articleService = services.articleService;

router.get('/articles', function(req, res){
  articleService.getArticles(req, res);
});
module.exports = router;
