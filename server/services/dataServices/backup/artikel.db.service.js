var Artikel = require('./../../models/artikel').Artikel;
var async = require('async');
var Scan = require('./../../models/lastScanned').Scan;
var count = 0;

exports.comparePrices = function(obj, next){
    var converted = JSON.parse(JSON.stringify(obj));
    var namn = converted.Namn;
    var nr = converted.nr;
    var Prisinklmoms = converted.Prisinklmoms;
    var namn2 = converted.Namn2;
    var date = converted.lastFound;

    async.waterfall([
        function(callback){
            Artikel.findOneAndUpdate(
                {'nr': nr}, function(err, doc){
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
                    count++;
                    if(nr == 7105001){
                        console.log("HArdy nr: ", nr + "  Hardy doc.nr: ", doc.nr);
                    }
                    Artikel.update({nr: nr }, {lastFound: date, Slut: false}, {}, function(err, obj){
                        if(err){
                            console.log("error in 1.doc.save: ", err);
                            return new Error(err);
                        }

                        count++;

                        callback(null, doc);
                    });
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

                }else if(!(doc.Namn == namn)){
                    console.log("But-", namn + "- does not equal-", doc.Namn + "- stored in information place");
                    Artikel.update({nr: nr }, {Namn: namn, Namn2: namn2}, {}, function(err, obj){
                        if(err){
                            console.log("Error when attempting to update the name of an article: ", err);
                            return new Error(err);
                        }
                    });

                }
                callback(null);




        },
        function(callback){

            Artikel.findOne({'nr': nr, 'Prisinklmoms': {$gt:Prisinklmoms}}, function(err, doc) {
                if(err) {
                    return callback(err);
                }else if(typeof doc == 'undefined' || !doc){
                    //console.log("article with a lower price not found. callback(next, null)");
                    callback("next", doc);
                }else{
                    console.log("article with a lower price found. callback(null, null)");
                    callback(null, doc);
                }
            });
        },
        //SEE https://blog.serverdensity.com/checking-if-a-document-exists-mongodb-slow-findone-vs-find/ --- CHANGE TO FIND INSTEAD OF FINDONE?
        function(arg1, callback){
            if(arg1){
                console.log(arg1.nr + " pris är sänkt från ", arg1.Prisinklmoms ,"till: " + Prisinklmoms);
                var PrissanktProcent = ((100*(1 - ((Prisinklmoms) / (arg1.Prisinklmoms)))).toFixed(1) );
                console.log(PrissanktProcent);
                arg1.update(
                    {$push :
                        {
                            'Prishistorik' : {
                                $each: [{timestamp: date, pris : Prisinklmoms}],
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
                        }else{
                            callback(null, arg1);
                        }

                    }
                );
            }else{
                console.log("article-db.service: waterfall, pris är sänkt från, !args. - shouldn't be reached");
            }
            callback(null, arg1);

        },
        function(arg1, callback){
            Artikel.findById(arg1["id"], function(err, doc){
                if(err){
                    return callback(err, doc);
                }if(doc){

                    doc.Prisinklmoms  = Prisinklmoms;
                    doc.save(callback);
                }

            });
        },


    ], function(err, result){
        if(err){
            if(err.localeCompare("next") === 0){
                //do nothing
            }else{
                console.log("stupid error in final shit ass: ", err);
                return next(err);
            }
        }
        /* // ERROR MESSAGE: [Error: document must have an _id before saving]
        var date = new Date();
        var scan= new Scan({lastScanned: date});
        scan.save(function(err, savedDoc){
            if(!err){
                console.log(savedDoc._id);
            }else{
                console.log("serious errer in saving Scan: ", err);
            }

        });
        */

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
    var date;
    console.log("hi1");
    //db.artiklar.find(({}).sort({ lastFound: -1 }).limit(1);
    Artikel.findOne({},{}, { sort: { "lastFound" : -1 } }, function(err, doc){
        if(err){
            console.log("hi2");
            return next(err);
        }if(doc){
            console.log(doc);

            var date = new Date(doc.lastFound);

            //console.log(new Date(date.getFullYear().toString() + "-" + date.getMonth().toString() + "-" + ("0" + date.getDate()).slice(-2).toString()));

            var yesterday = new Date(date.setDate(date.getDate()-2));
            //(new Date(date.getFullYear().toString() + "-" + (date.getMonth()+1).toString() + "-" + ("0" + (date.getDate()-1)).slice(-2).toString())).toISOString();
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



    /*
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
    */
    //Check for artikelId
    //If found: update values
    //else: delete object
};
