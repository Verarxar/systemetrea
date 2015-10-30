var Artikel = require('./../../models/artikel').Artikel;
var async = require('async');
var Scan = require('./../../models/lastScanned').Scan;

exports.comparePrices = function(obj, next){
    var converted = JSON.parse(JSON.stringify(obj));
    var namn = converted.Namn;
    var nr = converted.nr;
    var varnummer = converted.Varnummer;
    var Prisinklmoms = converted.Prisinklmoms;
    var namn2 = converted.Namn2;
    
    async.waterfall([
        function(callback){
            Artikel.findOne({'nr': nr}, function(err, doc){
                if(err){
                    console.log(err);
                    return new Error(err);
                }
                if(!doc){
                    console.log("not found: ", nr);
                    console.log("and it looks like this:", obj);
                    var artikel = new Artikel(obj);
                    console.log(artikel.nr);
                    artikel.save(function(err){
                        if(err){
                          return callback(err);
                        }
                        console.log("file saved, prolly");
                        callback(null, artikel);
                        //it would make more sense to go !doc, else callback. But yeah.
                    });
                }
                else{
                    doc.lastFound = new Date();
                    doc.markModified('lastFound');
                    doc.save(function(err){
                        if(err){
                            console.log("error in 1.doc.save: ", err);
                            return new Error(err);
                        }
                        callback(null, doc);
                    });
                }
            });
            
        },
        function(doc, callback){
            if(doc != null){
                //console.log("checking equality between: ", doc.Namn, " ", namn);
                if(!(namn.toLowerCase().indexOf(doc.Namn.toLowerCase()) >=0) && !(doc.Namn.toLowerCase().indexOf(namn.toLowerCase()) >=0) ){
                    console.log(namn + " is not even a part of ", doc.Namn + " which is currenty in database");
                    doc.remove(function(err){
                        if(err){
                            console.log("Error when attempting to remove document: ", err);
                            return new Error(err);
                        }
                    });
                }else if(!(doc.Namn == namn)){
                    console.log("But-", namn + "- does not equal-", doc.Namn + "- stored in information place");
                    doc.Namn = namn;
                    doc.Namn2 = namn2;
                    doc.save(function(err){
                        if(err){
                            console.log("Error when attempting to update the name of an article: ", err);
                            return new Error(err);
                        }
                    });
                }
            
            }

            callback(null);
        },
        function(callback){
            
            Artikel.findOne({'nr': nr, 'Prisinklmoms': {$gt:Prisinklmoms}}, function(err, doc) {
                if(err) {
                    return callback(err);
                }else if(typeof doc == 'undefined' || !doc){
                    return callback("next", null);
                  
                }else{
                    callback(null, doc);     
                }
            });
        },
        //SEE https://blog.serverdensity.com/checking-if-a-document-exists-mongodb-slow-findone-vs-find/ --- CHANGE TO FIND INSTEAD OF FINDONE?
        function(arg1, callback){
            console.log(arg1.nr + " pris är sänkt från ", arg1.Prisinklmoms ,"till: " + Prisinklmoms);
            var PrissanktProcent = ((100*(1 - ((Prisinklmoms) / (arg1.Prisinklmoms)))).toFixed(1) );
            console.log(PrissanktProcent);
            arg1.update(
                {$push : 
                    {
                        'Prishistorik' : {
                            $each: [{timestamp: Date(), pris : Prisinklmoms}],
                            $position: 0 },
                    }, 
                $set : 
                    {
                         'PrissanktProcent' : PrissanktProcent
                    }
                },
                function(err, doc) {
                    if (err){
                        return callback(err);
                    }
                    callback(null, arg1);
                }
            );
        },
        function(arg1, callback){
            Artikel.findById(arg1["id"], function(err, doc){
                if(err){
                    return callback(err, doc);
                }if(doc){

                    doc.Prisinklmoms  = Prisinklmoms;
                    doc.save(callback);
                    callback(null, doc);
                }else{
                    console.log("ever in here?");
                    callback(null, null);    
                }
                
                
            });
        },
        
       
    ], function(err, result){
        
        if(err.localeCompare("next") === 0){
            next(null);
        }
        else if(err.localeCompare("new") === 0){
            console.log("a new article was found /signed \nresult method in artikel.db.service");
            next(null);
        }
        else if(err){
            console.log("error");
            return(next(err));
        }
        else{
            console.log(result);
             // ERROR MESSAGE: [Error: document must have an _id before saving]
            var date = new Date();
            var scan= new Scan({lastScanned: date});
            console.log('about to svae');
            scan.save(function(err, savedDoc){
                if(!err){
                    console.log(savedDoc._id);
                }else{
                    console.log("serious errer in saving Scan: ", err);    
                }
                
            } );            
            next(null, result);    
        }
        
        


    });
};

exports.getLeastFive = function(next){
    Artikel.find({ PrissanktProcent : { $gte : 5 }}, function(err, data){
        if(err){
            return next(err);
        }
        next(null, data);
    });
    
};

exports.getDateChanged = function(date, next){

    // db.artiklar.count({ $and: [    { PrissanktProcent: {$gte: 5}}, { 'Prishistorik.timestamp' : {  $gte: new Date("2015-10-06")}}]})
    Artikel.find({ $and: [    { PrissanktProcent: {$gte: 5}}, { 'Prishistorik.timestamp' : {  $gte: new Date("2015-10-06")}}]}, function(err, data){
        if(err){
            return next(err);
        }
        next(data);
    });
};

exports.getRom = function (next){
    Artikel.find({Varugrupp: "Rom"}, function(err, data){
        if(err){
            return next(err);
        }
        next(null, data);
    });
};

//Checks for articles not updated during the last scan and deletes them
exports.updateDatabase = function (next){
    var dateToday = new Date().toISOString();
    
    console.log(dateToday);
    Artikel.find({lastFound: {$lt: dateToday}}, function(err, docs){
        if(err){
            console.log(err);
            return next(new Error(err));
        }
        var articleMap = {};
        docs.forEach(function(doc){
            articleMap[doc] = doc;
        });

        next(null, articleMap);
    });
    
    //Check for artikelId
    //If found: update values
    //else: delete object
};