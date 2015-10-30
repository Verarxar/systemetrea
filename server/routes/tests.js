var express = require('express');
var router = express.Router();
var xmlservice = require('../services/dataServices/xml.service');
var jsonservice = require('../services/dataServices/json.service2');
var deliveryService = require('../services/dataServices/delivery.service');
var downloaded = false;
var apistreamer = require('../services/dataServices/api.streamer.service');
var artikelDB = require('../services/dataServices/artikel.db.service');

router.get('/goxml', function(req, res, next){
    if(!downloaded){
        xmlservice.getXml(function(err){
            if(err){
                next('failed to fetch database');
                console.log(err);
            }
            downloaded = true;
            res.send("Hello World!");
        });
    }
});

// Scans XML file and pushes content into the Databsae. 
// Warning: No logic, just pushes stuff right in there. Use when databse is empty or when new articles has been release, or old one removed, when you're drunk or when the daily life simply needs to be spiced up.
router.get('/convert', function(req, res, next){
    console.log("Helo let's convert, k");
    jsonservice.convert('sortimentfilen.xml',function(err){
        if(err){
            console.log(err);
            res.send(err);
        }
        
        res.send("Database fetched & conerted successfully");
    });
                
});

//Compares content of sortimentfilen.xml with the databse. 
// 
router.get('/compare', function(req, res, next){
    var vm = {
        message: "Articles: "
    };
    apistreamer.beginScan(function(err, data){
        console.log("returned to routes.tests");
        if(err){
            vm.message = {
            "err": "error message: " + err,
            "message": "Personal designed error message: An error occured",
            };
            //return res here instead of just res.status prevents from continuing past the error message
            
            return res.status(500).json(vm);
        }
        vm.message += ", " + data;
        res.json(vm);
    });
});

var test = require('../tests/unit.testing');

router.get('/testrun', function(req, res, next){
    
    test.run(function(err, data){
        if(err){
            return res.status(500).json({error:'failed to check DB'});
        }
        res.json(data);
    });

});

router.get('/gogetmod', function(req, res, next){
    
    test.fetchUsers(function(err, data){
        if(err){
            return res.status(500).json({error:err});
        }
        deliveryService.prepareMail(data, function(err, status){
            if(err){
                return res.json(err);
            }
            res.json(status);
        });
        
    });

});

router.get('/getOld', function(req, res, next){
    
    artikelDB.updateDatabase(function(err, data){
        if(err){
            return res.status(500).json({error:err});
        }

        res.json(data);
    });

});

module.exports = router;