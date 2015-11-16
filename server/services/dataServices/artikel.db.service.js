var Artikel = require('./../../models/artikel').Artikel;
var async = require('async');

exports.comparePrices = function(obj, next){
    var converted = JSON.parse(JSON.stringify(obj));
    var namn = converted.Namn;
    var nr = converted.nr;
    var Prisinklmoms = converted.Prisinklmoms;
    var namn2 = converted.Namn2;
    var date = converted.lastFound;

    async.waterfall([
        function(callback){
            Artikel.findOne({'nr': nr},function(err, doc){
                if(err){
                    console.log(err);
                    return new Error(err);
                }
                if(!doc){
                    var artikel = new Artikel(obj);
                    artikel.save(function(err){
                        if(err){
                          console.log("error in !doc.save: ", err);
                          
                          return callback(err);
                        }

                        callback("next", null);

                    });
                }
                else{
                    callback(null, doc);
                }
            });
        },
        function(doc, callback){
            
                    /*
                    *   When a name change on an article, it's usually one of three scenarios: Spelling error being corrected, the name was simply changed entirely or slightly adjusted,
                    *   or it's an entirely new product that has replaced the previous article's "Varunummer".
                    *   This checks wether there is any similarity of the new and old name. If not, object is completely removed.
                    */
                if(!(namn.toLowerCase().indexOf(doc.Namn.toLowerCase()) >=0) && !(doc.Namn.toLowerCase().indexOf(namn.toLowerCase()) >=0) ){
                    if(doc.Namn2.length != 0){
                        var res = doc.Namn2.localeCompare(namn2);
                        console.log("comparing doc.Namn2 with namn2",res);
                    }else{
                        console.log("Namn2.length == 0");
                    }
                    console.log(namn + " is not even a part of ", doc.Namn + " which is currenty in database");
                    
                    /*
                    *   Reached when "nr" of an old article has been replaced with a new article.
                    *   Previous article is no longer in systembolagets product range. Old article is removed.
                    */
                    doc.remove(function(err){
                        if(err){
                            console.log("Error when attempting to remove document: ", err);
                            return new Error(err);
                        }
                        /*
                        *   Old article with "nr": (obj.nr), removed.
                        *   New article added to database. Callback "next" to skip ahead, new article means no price change.
                        */                    
                        var artikel = new Artikel(obj);
                        artikel.save(function(err){
                            if(err){
                              console.log("error in !doc.save: ", err);
                              return callback(err);
                            }
                            
                            console.log("file saved, prolly");
                            callback("next", null);
    
                        });                        
                    });

                }else if(!(doc.Namn.localeCompare(namn) === 0)){
                    console.log("But-", namn + "- does not equal-", doc.Namn + "- stored in information place");
                    doc.Namn = namn;
                    doc.Namn2 = namn2;
        
                }
                doc.lastFound = date;
                doc.Slut = false;
                doc.markModified('lastFound');
                doc.save(function(err, res, numAffected){
                    if(err){
                        return callback(err);
                    }
                    callback(null, res);
                });
        },
        function(arg1, callback){
            
            if(typeof arg1 == 'undefined' || !arg1){
                //console.log("article with a lower price not found. callback(next, null)");
                callback("next", null);
            }else if(arg1.Prisinklmoms > Prisinklmoms){
                callback(null, arg1);
            }else{
                callback("next", null);
            }
        },
        //SEE https://blog.serverdensity.com/checking-if-a-document-exists-mongodb-slow-findone-vs-find/ --- CHANGE TO FIND INSTEAD OF FINDONE?
        function(arg1, callback){
            if(arg1){
                console.log(arg1.nr + " pris är sänkt från ", arg1.Prisinklmoms ,"till: " + Prisinklmoms);
                var PrissanktProcent = ((100*(1 - ((Prisinklmoms) / (arg1.Prisinklmoms)))).toFixed(1) );
                console.log(PrissanktProcent);
                arg1.Prishistorik.unshift({timestamp: date, pris : Prisinklmoms});
                arg1.PrissanktProcent = PrissanktProcent;
                arg1.Prisinklmoms  = Prisinklmoms;
                arg1.save(function (err, doc){
                    if (err){
                        return callback(err);
                    }
                    callback(null, arg1);
                });
            }else{
                console.log("artikel.db.service: waterfall, pris är sänkt från, !args. - shouldn't be reached");
                callback(null, null);
            }


        },
    ], function(err, result){
        if(err){
            if(err == "next"){
                //do nothing
            }else{
                return next(err);
            }
        }

  
        next(null, result);
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

    // Corresponding MongoDB shell syntax:
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

exports.getLastDate = function(next){
    Artikel.findOne({},{}, { sort: { "lastFound" : -1 }},function(err, doc){
        if(err){
            console.log(err);
            return next(err);
        }if(doc){
            return next(null, doc.lastFound);
        }
    });
};
//Checks for articles not updated during the last scan and deletes them
exports.updateDatabase = function (next){
    var date;
    console.log("hi1");
    //MongoDB shell: db.artiklar.find({}).sort({ lastFound: -1 }).limit(1).pretty()
    Artikel.findOne({},{}, { sort: { "lastFound" : -1 } }, function(err, doc){
        if(err){
            console.log("hi2");
            return next(err);
        }if(doc){
            console.log(doc);
            var date = new Date(doc.lastFound);
            var yesterday = new Date(date.setDate(date.getDate()-2));
            
            var vm = {
                "artiklar": []
            };            
            console.log(yesterday);
            
            Artikel.count({ 'lastFound' : {  $lte: yesterday}},  function(err, docs){
                if(err){
                    console.log(err);
                }
                console.log(docs);
            });
            var stream = Artikel.find({'lastFound': { $lte: yesterday}}).stream();
            stream.on("data", function(doc){
                
                doc.update(
                {$set: 
                    {
                         'Slut' : true
                    }
                },
                function(err, doc) {
                    if (err){
                        return next(err);
                    }else{
                        
                        vm.artiklar.push(doc);
                    }
                });       
            }).on('error', function(err){
                console.log("error in !doc.save: ", err);
                return next(err);
            }).on('close', function(){
                console.log("Stream is closed");
            });

        }
        next(null, vm);        

    });
};