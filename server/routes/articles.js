var express = require('express');
var router = express.Router();
var artikelDB = require('../services/dataServices/artikel.db.service');

router.get('/getArticles', function(req, res, next){
    artikelDB.getLeastFive(function(err, data){
        if(err){
            return res.status(500).json({error:'failed to check DB'});
        }
        res.json(data);
    });
});

module.exports = router;