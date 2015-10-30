var express = require('express');
var router = express.Router();
var path        = require('path');


router.get('/', function(req, res, next){

  res.sendFile(path.join(__dirname, '../../public/views', 'main.html'));
});


router.get('/8119a7d97b97d45aa5483109c37e380f', function(req, res, next){
  res.sendFile(path.join(__dirname, '../../public/views', 'home.html'));
});


module.exports = router;

