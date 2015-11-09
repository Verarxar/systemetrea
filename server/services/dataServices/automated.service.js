var async           = require ('async');
var _               = require('underscore')._;
var xmlService      = require('./xml.service');
var apiStreamer     = require('./api.streamer.service');
var artikelDB       = require('./artikel.db.service');
var fs              = require('fs');
var XmlStream = require('xml-stream');

exports.getfiledates = function(callback){
    fs.readdir('./server/services/dataServices/data/', function(err, files){
        if(err){
            return callback(err);
        }
        var list = files; 
        var date;
        async.eachSeries(files, function iterator(fileName, callback){
            var stream = fs.createReadStream('./server/services/dataServices/data/' + fileName);
            var parser = new XmlStream(stream);
            parser.on('endElement: skapad-tid', function(obj) {
                date = new Date(obj['$text']);
                console.log("file: ", fileName, " was created: ", date);
                callback();
            }); 
            
        }, function(err){
            if(err){
                console.log("not all done", err);
            }
            console.log("all done");
            callback(null);
        });
        
    });    
    
}
exports.run_all = function(callback){
    fs.readdir('./server/services/dataServices/data/', function(err, files){
        if(err){
            return callback(err);
        }
        var list = files; 
        async.eachSeries(files, function iterator(fileName, callback){
            apiStreamer.beginScan(fileName, callback);
        
            
        }, function(err){
            if(err){
                console.log("not all done", err);
            }
            console.log("all done");
            callback(null, list.length);
        });
        
    });
    
};

exports.run = function(callback) {
    async.waterfall([
        function(callback){
            console.log("hello");
    	    xmlService.getXml(function(err){
        		if(err){
        			console.log("in err, node schedule");
        			console.log(err);
        			return callback(err);
    		    }
    		    callback(null);
    	    });
        },function(callback){
    		xmlService.renameXml(function(err, fileName){
    			if(err){
    				console.log(err);
    				return callback(err);
    			}
    			console.log(fileName);
    			callback(null, fileName);
    		});     
        },function(fileName, callback){
            apiStreamer.beginScan(fileName, function(err, data){
                console.log("returned to routes.tests");
                var vm = {"message":"",
                        "data": []
                };
                if(err){
                    vm = {
                    "err": "error message: " + err,
                    "message": "Personal designed error message: An error occured",
                    };
                    //return res here instead of just res.status prevents from continuing past the error message
                    
                    return callback(vm);
                }
                vm.message = "The following articles were lowered in price:\n";
                for(var i in data){
                    vm.data.push(JSON.parse(JSON.stringify(data[i]))); 
                }
                
                
                callback(null, data);
            });
            
        }
    ],
        function (err, result) {
            if(err && err != "next"){
                return err;
            }if(result.length == 0){
                return callback(null, "No prices lowered");
            }
            artikelDB.updateDatabase(function(err, data){
                if(err){
                    return callback(err);
                }
                callback(null, result);
            });            

            
        }
    );    

};
