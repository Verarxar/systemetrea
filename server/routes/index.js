require('../models/mongo');
var express = require('express');
var ExpressBrute = require('express-brute');
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

var router = express.Router();
const services = require('../services');
const utilityService = services.utilityService;

router.get('/statistics', (req, res, next) => {
  utilityService.getStatistics(req, res);
});
router.use('/', require('./article.routes'));
router.use('/', bruteforce.prevent, require('./auth.routes').router);

module.exports = router;

