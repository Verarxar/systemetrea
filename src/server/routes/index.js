const express = require('express');
const router = express.Router();

require('../mongo').connect();

router.use('/admin', require('./admin'));
router.use('/articles', require('./articles'));

module.exports = router;

