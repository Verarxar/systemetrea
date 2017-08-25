const express = require('express');
const router = express.Router();
var articleService = require('./services/article.service');
var adminService = require('./services/admin.service');

router.get('/count', (req, res) => {
     articleService.getStats(req, res);
});

router.post('/', (req, res) => {
     articleService.compareArticles(req, res);
});

router.delete('/', (req, res) => {
     console.log("pls");
     adminService.dropDB(req, res);
});

router.post('/:fileName', (req, res) => {
     articleService.insertArticles(req, res);
});

module.exports = router;