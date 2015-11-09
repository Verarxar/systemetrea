var express = require('express');
var router = express.Router();
var xmlservice = require('../services/dataServices/xml.service');
var jsonservice = require('../services/dataServices/json.service2');
var deliveryService = require('../services/dataServices/delivery.service');
var downloaded = false;
var apistreamer = require('../services/dataServices/api.streamer.service');
var artikelDB = require('../services/dataServices/artikel.db.service');
var automated	 = require('../services/dataServices/automated.service');

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

router.get('/getfiledate', function(req, res, next){
    automated.getfiledates(function(err){
        if(err){
            return next(err);
        }
        res.send("done");
    });
    
});
router.get('/update', function(req, res, next){
    artikelDB.updateDatabase(function(err, data){
        if(err){
            return next(err);
        }
        res.json(data);
    });
    
});

// Scans XML file and pushes content into the Databsae. 
// Warning: No logic, just pushes stuff right in there. 
// Use when databse is empty or when new articles has been release, 
// or old one removed or when the daily life simply needs to be spiced up.
router.get('/insertall', function(req, res, next){
    automated.run_all(function(err, nbrOfFiles){
        if(err){
            return res.json(err);
        }
        res.send("Inserting " + nbrOfFiles + " files");
    });
    
                
});

//Compares content of sortimentfilen.xml with the databse. 
// 
router.get('/compare/:file', function(req, res, next){
    var vm = {
        message: "Articles: "
    };
    apistreamer.beginScan(req.params.file, function(err, data){
        console.log("returned to routes.tests");
        if(err){
            vm.message = {
            "err": "error message: " + err,
            "message": "Personal designed error message: An error occured",
            };
            //return res here instead of just res.status prevents from continuing past the error message
            
            return res.status(500).json(vm);
        }
        vm.message = "The following articles were lowered in price:\n";
        vm.data = JSON.stringify(data);
        
        res.json(vm);
    });
});

/*
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
*/
module.exports = router;