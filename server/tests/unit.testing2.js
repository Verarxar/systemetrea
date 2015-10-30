var artikelDBService = require('../services/dataServices/artikel.db.test');
var deliveryService = require('../services/dataServices/delivery.service');
var apiStreamer = require('./../services/dataServices/api.streamer.service');
var async = require('async');

exports.run = function(next){
    var arr = [];
        apiStreamer.beginScan(function(err, data){
            async.waterfall([
                function(callback){
                    artikelDBtest.comparePrices(data, function(err, data){
                        if(err){
                            return callback(err);
                            
                        }
                        }
                
                    )
                }
        });
        
        },
        function(arg1, callback) {
            artikelDBService.comparePrices(arg1, function(err, data){
                if(err){
                    return callback(err);
                }if(data == null || typeof data == 'undefined'){
                    return callback("error");
                }else{
                    //console.log(data);
                    arr.push(JSON.stringify(data));
                    callback(null, data);
                }

            });
        }

    ],
        function (err, result) {
            if(arr){
                return next(null, arr);
            }
            if(err){
                return;
            }
            next(null, "no data");
            
        }
    );
    
    
};
    
exports.fetchUsers = function(data, callback) {

    function setData(artikelData, next) {
        //console.log("Data in unit.testing prepareData (not currently being sent): ", artikelData);
        var dbResult;
        if(!artikelData){
            dbResult = {
                Varnummer: '71112',
                NyttPris: 1094.10,
                GammaltPris: 1194.10,
                Namn: 'Old Speckled Hen',
                Varugrupp: 'Öl',
                Procent: ''
            };
        }else{
            console.log("@setData, param: ", artikelData);
            dbResult = {
                Varnummer: artikelData.Varnummer,
                NyttPris: artikelData.Prisinklmoms,
                GammaltPris: artikelData.Prishistorik[1].pris,
                Namn: artikelData.Namn,
                Varugrupp: artikelData.Varugrupp(),
                Procent: ''
            };
            console.log("@setData, set string dbResult: ", dbResult);
        }
        function fetchUsers(data, callback) {
            console.log("@unit.testing, fetchUsers, expected arg1: price & percentage. Got: ", data);
            deliveryService.fetchUsers();
        }
        next(dbResult);
       /*
       deliveryService.prepareData(JSON.parse(JSON.stringify(dbResult)), function(data){
            console.log("@unit.testing, prepareData: Callback from deliveryService.prepareData: ", data);
            callback(null, data);
        });
        */
    }
};   



exports.prepareMail = function(recipients ,artikelData, callback) {

    };


