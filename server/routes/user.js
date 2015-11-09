var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');
var https = require('https');
var path        = require('path');

router.get('/getUser/:email', function(req, res, next){
    console.log("req.data in user.js, getUsers: ", req.params);
    userService.getUser(req.params.email, function(data){
        console.log("logging callback data from userService.getUser: ", data);
        res.json(data);
    });
});

router.post('/addUser', function(req, res, next) {
 
    console.log("req.body: "+ (req.body));
    userService.userCall(req.body, function(err, data){
        if(err){
            var vm  = {
                title: 'Account settings',
                input: req.body,
                error: err
            };
            console.log("req.body in /adduser, users.js: ", req.body);  
            console.log("Error in addUser @ user.js: ", err);
    
            return next(vm);
        }
        res.json(data);
    });
    
});


router.post('/register', function(req, res, next){

    console.log("entered");
    var PRIVATE_KEY = "6LfqHQwTAAAAAL3vNhhC6_xVlGwtzUntG4gg2AGq";
    var options = {
        host:'www.google.com',
        verify:'/recaptcha/api/siteverify'
    };

    var data = null;
    if (!req) throw new Error('req is required');
    if(req.body && req.body['captcha']){
        data = {
            remoteip:  req.connection.remoteAddress,
            response:  req.body.captcha
        };
    }

    var query_string = '?secret='+PRIVATE_KEY+'&response='+data.response+'&remoteip'+data.remoteip;
    https.get("https://"+options.host+options.verify+query_string, function(reply) {
        var body = '';
        reply.on('data', function(chunk) {
          body += chunk;
        });
        reply.on('end', function() {
            var result = JSON.parse(body);
            var error = result['error-codes'] && result['error-codes'].length > 0 ? result['error-codes'][0] : 'invalid-input-response';
            if (result.success){
                console.log("console logging body in success: ", body);
                res.json(result);
            }
            else {
                console.log("Server: ---- /register ---- if !result.success: ", error);
                res.json(error);
            }
        });
        reply.on('error', function(e) {
            console.log("Server: ---- /register ---- reply.on('error'): ", e);
          return next(e.message);
        });
    });
});


var artikelDB = require('../services/dataServices/artikel.db.service');
/*
*  Side project: Below lists a type of article as a list that can be copy pasted into excel (for example).
*/
router.get('/martin', function(req, res, next){
    var presentation = "";
    artikelDB.getRom(function(err, data){
        if(err){
            return res.status(500).json({error:'failed to check DB'});
        }
         data.sort(function(a, b){
            var nameA=a.Namn.toLowerCase(), nameB=b.Namn.toLowerCase()
            if (nameA < nameB) //sort string ascending
            return -1 
            if (nameA > nameB)
            return 1
            return 0 //default return value (no sorting)
        })

        presentation = "<br><br><style>table, th, td {border: 1px solid black;border-spacing: 0.5rem;text-align: left;}col {display: table-column;}</style><table><tr><th>Namn</th><th>Prisinklmoms</th><th>Land</th><th>Artikelnummer</th><th>Alkoholhalt</th></tr>"
        for(var i = 0; i< data.length; i++){
            presentation += "<tr><th>" + data[i].Namn + "&#160;," + data[i].Namn2 + "</th><th>" + data[i].Prisinklmoms + "</th><th>" + data[i].Ursprunglandnamn + "</th><th>" + data[i].Varnummer + "</th><th>" + data[i].Alkoholhalt +"</th></tr>";
        }
        presentation += "</table>"
        res.send(presentation);
    });

});



module.exports = router;